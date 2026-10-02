import { writeBatch, doc, getDoc, getDocs, collection, serverTimestamp, increment, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';

// ==========================================
// User Profiles
// ==========================================

export const createUserProfile = async (uid: string, email: string | null, name: string | null) => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid,
      email,
      name: name || 'Sandhyā User',
      username: `@${(name || 'user').toLowerCase().replace(/\s+/g, '')}${Math.floor(Math.random() * 1000)}`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      currentStreak: 0,
      bestStreak: 0,
      totalSessions: 0,
    });
  }
};

// ==========================================
// Circles & Invites
// ==========================================

export const createCircle = async (uid: string, name: string) => {
  // First, check if a global circle already exists
  const globalRef = doc(db, 'circleSettings', 'global');
  const globalSnap = await getDoc(globalRef);
  
  if (globalSnap.exists() && globalSnap.data().isActive) {
    const existingCircleId = globalSnap.data().circleId;
    
    // Instead of creating, just join the existing global circle
    const memberRef = doc(db, `circles/${existingCircleId}/members`, uid);
    const memberSnap = await getDoc(memberRef);
    if (!memberSnap.exists()) {
      const batch = writeBatch(db);
      batch.set(memberRef, {
        uid,
        role: 'member',
        joinedAt: serverTimestamp(),
        todayCompleted: 0,
        lastCompletedDate: null,
        currentStreak: 0
      });
      batch.update(doc(db, 'users', uid), { circleId: existingCircleId });
      batch.update(doc(db, 'circles', existingCircleId), { memberCount: increment(1) });
      await batch.commit();
    }
    return existingCircleId;
  }

  // Otherwise, create a new circle and make it the global one
  const batch = writeBatch(db);
  
  const circleRef = doc(collection(db, 'circles'));
  batch.set(circleRef, {
    name,
    createdBy: uid,
    createdAt: serverTimestamp(),
    memberCount: 1,
  });

  const memberRef = doc(db, `circles/${circleRef.id}/members`, uid);
  batch.set(memberRef, {
    uid,
    role: 'owner',
    joinedAt: serverTimestamp(),
    todayCompleted: 0,
    lastCompletedDate: null,
    currentStreak: 0
  });

  const userRef = doc(db, 'users', uid);
  batch.update(userRef, {
    circleId: circleRef.id
  });

  // Register this as the global circle
  batch.set(globalRef, {
    joinCode: "6726",
    circleId: circleRef.id,
    isActive: true
  });

  await batch.commit();
  return circleRef.id;
};

// ─── Helper: bootstrap global circle if it doesn't exist yet ────────────────
const bootstrapGlobalCircle = async (uid: string) => {
  const globalRef = doc(db, 'circleSettings', 'global');
  const batch = writeBatch(db);

  const circleRef = doc(collection(db, 'circles'));
  batch.set(circleRef, {
    name: 'Sandhyā Circle',
    createdBy: uid,
    createdAt: serverTimestamp(),
    memberCount: 1,
  });

  const memberRef = doc(db, `circles/${circleRef.id}/members`, uid);
  batch.set(memberRef, {
    uid,
    role: 'owner',
    joinedAt: serverTimestamp(),
    todayCompleted: 0,
    lastCompletedDate: null,
    currentStreak: 0,
  });

  batch.update(doc(db, 'users', uid), { circleId: circleRef.id });

  batch.set(globalRef, {
    joinCode: '6726',
    circleId: circleRef.id,
    isActive: true,
  });

  await batch.commit();
  return circleRef.id;
};

export const previewCircle = async (code: string) => {
  if (code.trim() !== '6726') throw new Error('invalid_code');

  const globalRef = doc(db, 'circleSettings', 'global');
  const globalSnap = await getDoc(globalRef);

  // If no global circle is set up yet, return a placeholder preview
  if (!globalSnap.exists() || !globalSnap.data().isActive || !globalSnap.data().circleId) {
    return { id: '__new__', name: 'Sandhyā Circle', memberCount: 0 };
  }

  const data = globalSnap.data();
  const circleRef = doc(db, 'circles', data.circleId);
  const circleSnap = await getDoc(circleRef);

  if (!circleSnap.exists()) {
    return { id: '__new__', name: 'Sandhyā Circle', memberCount: 0 };
  }

  const circleData = circleSnap.data();
  return {
    id: data.circleId,
    name: circleData.name || 'Sandhyā Circle',
    memberCount: circleData.memberCount || 0,
  };
};

export const validateAndJoinCircle = async (code: string, uid: string) => {
  if (code.trim() !== '6726') throw new Error('invalid_code');

  const globalRef = doc(db, 'circleSettings', 'global');
  const globalSnap = await getDoc(globalRef);

  // If no circle exists yet, auto-create one and make this user the owner
  if (!globalSnap.exists() || !globalSnap.data().isActive || !globalSnap.data().circleId) {
    await bootstrapGlobalCircle(uid);
    return;
  }

  const data = globalSnap.data();
  const circleId = data.circleId;

  const memberRef = doc(db, `circles/${circleId}/members`, uid);
  const memberSnap = await getDoc(memberRef);
  if (memberSnap.exists()) throw new Error('already_member');

  const batch = writeBatch(db);
  batch.set(memberRef, {
    uid,
    role: 'member',
    joinedAt: serverTimestamp(),
    todayCompleted: 0,
    lastCompletedDate: null,
    currentStreak: 0,
  });
  batch.update(doc(db, 'users', uid), { circleId });
  batch.update(doc(db, 'circles', circleId), { memberCount: increment(1) });
  await batch.commit();
};

export const joinCircle = async (circleId: string, uid: string) => {
  const memberRef = doc(db, `circles/${circleId}/members`, uid);
  const snap = await getDoc(memberRef);
  
  if (snap.exists()) {
    throw new Error("already_member");
  }

  const batch = writeBatch(db);
  
  batch.set(memberRef, {
    uid,
    role: 'member',
    joinedAt: serverTimestamp(),
    todayCompleted: 0,
    lastCompletedDate: null,
    currentStreak: 0
  });
  
  batch.update(doc(db, 'users', uid), {
    circleId: circleId
  });

  batch.update(doc(db, 'circles', circleId), {
    memberCount: increment(1)
  });

  // Create notification for the circle owner could go here

  await batch.commit();
};



// ==========================================
// Sessions & Progress
// ==========================================

// ─── Record session + update Circle daily progress ───────────────────────────
export const recordSession = async (uid: string, type: 'pratah' | 'madhyahnika' | 'sayam', dateStr: string) => {
  const sessionId = `${dateStr}-${type}`;
  const sessionRef = doc(db, `users/${uid}/sessions`, sessionId);
  
  const snap = await getDoc(sessionRef);
  if (snap.exists() && snap.data().completed) return;

  const batch = writeBatch(db);

  batch.set(sessionRef, {
    type,
    date: dateStr,
    completed: true,
    completedAt: serverTimestamp()
  });

  batch.update(doc(db, 'users', uid), { totalSessions: increment(1) });

  const userSnap = await getDoc(doc(db, 'users', uid));
  if (userSnap.exists()) {
    const uData = userSnap.data();
    if (uData.circleId) {
      // Update circle member progress
      const memberRef = doc(db, `circles/${uData.circleId}/members`, uid);
      const memberSnap = await getDoc(memberRef);
      if (memberSnap.exists()) {
        const mData = memberSnap.data();
        let todayCompleted = mData.todayCompleted || 0;
        if (mData.lastCompletedDate !== dateStr) todayCompleted = 0;
        batch.update(memberRef, {
          todayCompleted: todayCompleted + 1,
          lastCompletedDate: dateStr
        });
      }

      // Update circle dailyProgress (Circle-visible, not private)
      const dpRef = doc(db, `circles/${uData.circleId}/dailyProgress`, `${dateStr}_${uid}`);
      const dpSnap = await getDoc(dpRef);
      const dpData = dpSnap.exists() ? dpSnap.data() : {
        uid, date: dateStr, name: uData.name || 'Member',
        pratahCompleted: false, madhyahnikaCompleted: false, sayamCompleted: false,
        completedCount: 0, currentStreak: uData.currentStreak || 0, updatedAt: null
      };

      const updated = {
        ...dpData,
        [`${type}Completed`]: true,
        completedCount: (dpData.completedCount || 0) + 1,
        currentStreak: uData.currentStreak || 0,
        updatedAt: serverTimestamp()
      };
      batch.set(dpRef, updated, { merge: true });

      // Post to activity feed
      const sessionNames: Record<string, string> = {
        pratah: 'Prātaḥ', madhyahnika: 'Mādhyāhnika', sayam: 'Sāyam'
      };
      const actRef = doc(collection(db, `circles/${uData.circleId}/activity`));
      batch.set(actRef, {
        uid,
        name: uData.name || 'A member',
        type: 'session_complete',
        session: type,
        sessionName: sessionNames[type],
        message: `completed ${sessionNames[type]}`,
        createdAt: serverTimestamp()
      });

      // Update challenge participants if in active challenge
      const challengeQ = query(
        collection(db, 'challenges'),
        where('circleId', '==', uData.circleId),
        where('status', '==', 'active')
      );
      const challengeSnap = await getDocs(challengeQ);
      if (!challengeSnap.empty) {
        const challengeId = challengeSnap.docs[0].id;
        const partRef = doc(db, `challenges/${challengeId}/participants`, uid);
        const partSnap = await getDoc(partRef);
        if (partSnap.exists()) {
          const pData = partSnap.data();
          let todayCount = pData.todaySessionCount || 0;
          if (pData.lastActiveDate !== dateStr) todayCount = 0;
          const newCount = todayCount + 1;
          const daysCompleted = newCount === 3 ? (pData.daysCompleted || 0) + 1 : (pData.daysCompleted || 0);
          batch.update(partRef, {
            daysCompleted,
            todaySessionCount: newCount,
            lastActiveDate: dateStr,
            updatedAt: serverTimestamp()
          });
        }
      }
    }
  }

  await batch.commit();
};


// ==========================================
// Challenges
// ==========================================

export const createChallenge = async (circleId: string, creatorUid: string, name: string) => {
  const challengeRef = doc(collection(db, 'challenges'));
  
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  await setDoc(challengeRef, {
    name,
    circleId,
    creatorId: creatorUid,
    startDate,
    endDate,
    duration: 30,
    status: 'active',
    createdAt: serverTimestamp(),
    inviteCode: Math.random().toString(36).substring(2, 10).toUpperCase()
  });
  
  return challengeRef.id;
};

// ==========================================
// Encouragement & Reactions
// ==========================================

export const sendEncouragement = async (fromUid: string, fromName: string, toUid: string, reaction: string) => {
  const encouragementRef = doc(collection(db, `users/${toUid}/encouragements`));
  
  await setDoc(encouragementRef, {
    fromUid,
    fromName,
    reaction,
    createdAt: serverTimestamp()
  });
};

// ─── Join a challenge ─────────────────────────────────────────────────────────
export const joinChallenge = async (challengeId: string, uid: string, name: string) => {
  const partRef = doc(db, `challenges/${challengeId}/participants`, uid);
  const snap = await getDoc(partRef);
  if (snap.exists()) return; // already joined
  await setDoc(partRef, {
    uid,
    name,
    daysCompleted: 0,
    todaySessionCount: 0,
    lastActiveDate: null,
    joinedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  await updateDoc(doc(db, 'challenges', challengeId), { participantCount: increment(1) });
};

// ─── Send reaction / encouragement ───────────────────────────────────────────
export const sendReaction = async (
  circleId: string,
  fromUid: string,
  fromName: string,
  toUid: string,
  toName: string,
  emoji: string
) => {
  const actRef = doc(collection(db, `circles/${circleId}/activity`));
  await setDoc(actRef, {
    uid: fromUid,
    name: fromName,
    type: 'reaction',
    toUid,
    toName,
    emoji,
    message: `sent ${emoji} to ${toName}`,
    createdAt: serverTimestamp()
  });
  // Also notify the recipient
  const notifRef = doc(collection(db, `users/${toUid}/notifications`));
  await setDoc(notifRef, {
    type: 'reaction',
    fromUid,
    fromName,
    emoji,
    message: `${fromName} sent you ${emoji}`,
    read: false,
    createdAt: serverTimestamp()
  });
};
