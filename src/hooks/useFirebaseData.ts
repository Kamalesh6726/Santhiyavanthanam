import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, where, getDocs, getDoc, setDoc, deleteDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../store/AuthContext';
import type { User, Session, Friend, Wisdom, Mantra } from '../types';

export const useUserData = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', currentUser.uid), 
      (docSnap) => {
        if (docSnap.exists()) {
          setUserData(docSnap.data() as User);
        } else {
          setUserData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("[Firestore ERROR] useUserData:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return { userData, loading, error };
};

export const useTodaySessions = (dateStr: string) => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setSessions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, `users/${currentUser.uid}/sessions`),
      where('date', '==', dateStr)
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => doc.data() as Session);
        setSessions(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("[Firestore ERROR] useTodaySessions:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, dateStr]);

  return { sessions, loading, error };
};

export const useWeeklySessions = (weekDatesStr: string[]) => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentUser || weekDatesStr.length === 0) {
      setSessions([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, `users/${currentUser.uid}/sessions`),
      where('date', 'in', weekDatesStr)
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        const docs = snapshot.docs.map(doc => doc.data() as Session);
        setSessions(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("[Firestore ERROR] useWeeklySessions:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, weekDatesStr.join(',')]); // Use joined string for stable dependency

  return { sessions, loading, error };
};

export const useMyCircle = () => {
  const { currentUser } = useAuth();
  const [circle, setCircle] = useState<any | null>(null);
  const [members, setMembers] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setCircle(null);
      setMembers([]);
      setLoading(false);
      return;
    }

    let unsubscribeCircle: (() => void) | undefined;
    let unsubscribeMembers: (() => void) | undefined;

    const unsubscribeUser = onSnapshot(
      doc(db, 'users', currentUser.uid), 
      (userSnap) => {
        try {
          const uData = userSnap.data();
          if (uData?.circleId) {
            // Setup Circle Listener
            if (!unsubscribeCircle) {
              unsubscribeCircle = onSnapshot(
                doc(db, 'circles', uData.circleId), 
                (circleSnap) => {
                  setCircle({ id: circleSnap.id, ...circleSnap.data() });
                  setError(null);
                },
                (err) => {
                  console.error("[Firestore ERROR] useMyCircle (circle):", err);
                  setError(err);
                }
              );
            }

            // Setup Members Listener
            if (!unsubscribeMembers) {
              unsubscribeMembers = onSnapshot(
                collection(db, `circles/${uData.circleId}/members`), 
                async (membersSnap) => {
                  try {
                    const memberPromises = membersSnap.docs.map(async (m) => {
                      try {
                        const uSnap = await getDocs(query(collection(db, 'users'), where('uid', '==', m.id)));
                        if (!uSnap.empty) {
                          return { id: m.id, role: m.data().role, ...uSnap.docs[0].data(), ...m.data() };
                        }
                      } catch (innerErr) {
                        console.error(`Failed to load member profile ${m.id}`, innerErr);
                      }
                      // Fallback if user profile read fails but we have member data
                      return { id: m.id, role: m.data().role, ...m.data() };
                    });
                    
                    const resolvedMembers = (await Promise.all(memberPromises)).filter(Boolean);
                    setMembers(resolvedMembers as any);
                    setLoading(false);
                    setError(null);
                  } catch (membersErr: any) {
                    console.error("[Firestore ERROR] useMyCircle (members processing):", membersErr);
                    setError(membersErr);
                    setLoading(false);
                  }
                },
                (err) => {
                  console.error("[Firestore ERROR] useMyCircle (members snapshot):", err);
                  setError(err);
                  setLoading(false);
                }
              );
            }
          } else {
            setCircle(null);
            setMembers([]);
            setLoading(false);
          }
        } catch (err: any) {
          console.error("[Firestore ERROR] useMyCircle processing:", err);
          setError(err);
          setLoading(false);
        }
      },
      (err) => {
        console.error("[Firestore ERROR] useMyCircle (user doc):", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeUser();
      if (unsubscribeCircle) unsubscribeCircle();
      if (unsubscribeMembers) unsubscribeMembers();
    };
  }, [currentUser]);

  return { circle, members, loading, error };
};

export const useChallenges = () => {
  const { currentUser } = useAuth();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setChallenges([]);
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let isMounted = true;

    const setupListener = async () => {
      try {
        const userSnap = await getDoc(doc(db, 'users', currentUser.uid));
        if (!isMounted) return;
        
        const circleId = userSnap.data()?.circleId;
        
        if (!circleId) {
          setChallenges([]);
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, 'challenges'),
          where('circleId', '==', circleId),
          where('status', '==', 'active')
        );

        unsubscribe = onSnapshot(
          q, 
          (snap) => {
            setChallenges(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
            setError(null);
          },
          (err) => {
            console.error("[Firestore ERROR] useChallenges (snapshot):", err);
            setError(err);
            setLoading(false);
          }
        );
      } catch (err: any) {
        console.error("[Firestore ERROR] useChallenges (setup):", err);
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    setupListener();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  return { challenges, loading, error };
};

export const useNotifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, `users/${currentUser.uid}/notifications`)
    );

    const unsubscribe = onSnapshot(
      q, 
      (snap) => {
        const notifs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        notifs.sort((a: any, b: any) => {
          const timeA = a.createdAt?.toDate().getTime() || 0;
          const timeB = b.createdAt?.toDate().getTime() || 0;
          return timeB - timeA;
        });
        setNotifications(notifs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("[Firestore ERROR] useNotifications:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return { notifications, loading, error };
};

export const useWisdom = () => {
  const [wisdom, setWisdom] = useState<Wisdom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'wisdom'),
      where('isPublished', '==', true)
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Wisdom));
        // Sort manually by displayOrder or createdAt
        items.sort((a, b) => {
          if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
            return a.displayOrder - b.displayOrder;
          }
          const timeA = a.createdAt?.toDate?.()?.getTime() || 0;
          const timeB = b.createdAt?.toDate?.()?.getTime() || 0;
          return timeB - timeA;
        });
        setWisdom(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("[Firestore ERROR] useWisdom:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { wisdom, loading, error };
};

export const useMantras = () => {
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'mantras'),
      where('isPublished', '==', true)
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Mantra));
        setMantras(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("[Firestore ERROR] useMantras:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { mantras, loading, error };
};

export const useSavedWisdom = () => {
  const { currentUser } = useAuth();
  const [savedWisdomIds, setSavedWisdomIds] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setSavedWisdomIds([]);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, `users/${currentUser.uid}/savedWisdom`),
      (snap) => {
        setSavedWisdomIds(snap.docs.map(doc => doc.id));
      },
      (err) => console.error("[Firestore ERROR] useSavedWisdom:", err)
    );

    return () => unsubscribe();
  }, [currentUser]);

  const toggleSave = async (wisdomId: string, isSaved: boolean) => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, `users/${currentUser.uid}/savedWisdom`, wisdomId);
      if (isSaved) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          savedAt: serverTimestamp()
        });
      }
    } catch (e) {
      console.error('Failed to toggle save:', e);
    }
  };

  return { savedWisdomIds, toggleSave };
};

// ─── Real-time daily progress for a whole circle ─────────────────────────────
export const useCircleDailyProgress = (circleId: string | null, dateStr: string) => {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!circleId) { setProgress([]); setLoading(false); return; }

    const unsubscribe = onSnapshot(
      collection(db, `circles/${circleId}/dailyProgress`),
      (snap) => {
        const items = snap.docs
          .map(d => ({ uid: d.id, ...d.data() }))
          .filter((d: any) => d.date === dateStr);
        setProgress(items);
        setLoading(false);
      },
      (err) => { console.error('[useCircleDailyProgress]', err); setLoading(false); }
    );
    return () => unsubscribe();
  }, [circleId, dateStr]);

  return { progress, loading };
};

// ─── Real-time circle activity feed ──────────────────────────────────────────
export const useCircleActivity = (circleId: string | null) => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!circleId) { setActivities([]); return; }

    const q = query(
      collection(db, `circles/${circleId}/activity`),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setActivities(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error('[useCircleActivity]', err));

    return () => unsubscribe();
  }, [circleId]);

  return { activities };
};

// ─── Challenge participants real-time ─────────────────────────────────────────
export const useChallengeParticipants = (challengeId: string | null) => {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!challengeId) { setParticipants([]); setLoading(false); return; }

    const unsubscribe = onSnapshot(
      collection(db, `challenges/${challengeId}/participants`),
      (snap) => {
        setParticipants(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => { console.error('[useChallengeParticipants]', err); setLoading(false); }
    );
    return () => unsubscribe();
  }, [challengeId]);

  return { participants, loading };
};
