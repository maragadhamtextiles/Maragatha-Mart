import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import {
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
  //signOut as firebaseSignOut,
  //onAuthStateChanged,
  //createUserWithEmailAndPassword,
  //signInWithEmailAndPassword
} from "firebase/auth";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { auth } from "../lib/firebase";
import { Database } from "../types/supabase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
type Role = Database["public"]["Tables"]["roles"]["Row"];

interface SignUpData {
  email: string;
  password: string;
  phone: string;
  name: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  userRole: Role | null;
  loading: boolean;
  signInWithPhone: (
    phone: string
  ) => Promise<{ verificationId: string | null; error: any }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>;
  checkExistingUser: (
    email: string,
    phone: string
  ) => Promise<{ exists: boolean; message?: string }>;
  signUp: (data: SignUpData) => Promise<{ error: any }>;
  verifyOTP: (verificationId: string, otp: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const navigate = useNavigate();

  // useEffect(() => {
  // Set up Firebase auth listener
  // const unsubscribeFirebase = onAuthStateChanged(auth, async (firebaseUser) => {
  //   if (firebaseUser) {
  //     try {
  //       // Create or get Supabase user
  //       const { data: { session: supabaseSession }, error: sessionError } = await supabase.auth.signInWithPassword({
  //         email: firebaseUser.email || `${firebaseUser.uid}@virtual.maragathamart.com`,
  //         password: firebaseUser.uid
  //       });

  //       if (sessionError) {
  //         // If sign in fails, try to create new user
  //         const { data: { session: newSession }, error: signUpError } = await supabase.auth.signUp({
  //           email: firebaseUser.email || `${firebaseUser.uid}@virtual.maragathamart.com`,
  //           password: firebaseUser.uid
  //         });

  //         if (signUpError) throw signUpError;
  //         if (newSession) setSession(newSession);
  //       } else if (supabaseSession) {
  //         setSession(supabaseSession);
  //       }

  //     } catch (error) {
  //       console.error('Error syncing auth:', error);
  //       toast.error('Authentication error');
  //       await firebaseSignOut(auth);
  //     }
  //   } else {
  //     setSession(null);
  //     setUser(null);
  //     setUserProfile(null);
  //     setUserRole(null);
  //   }
  //   setLoading(false);
  // });

  // Set up Supabase auth listener
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange(async (_event, session) => {
  //     setSession(session);
  //     setUser(session?.user ?? null);
  //     if (session?.user) {
  //       await fetchUserProfile(session.user.id);
  //     } else {
  //       setUserProfile(null);
  //       setUserRole(null);
  //     }
  //   });

  //   return () => {
  //     //unsubscribeFirebase();
  //     subscription.unsubscribe();
  //     if (recaptchaVerifierRef.current) {
  //       recaptchaVerifierRef.current.clear();
  //       recaptchaVerifierRef.current = null;
  //     }
  //   };
  // }, []);

  useEffect(() => {
    // Set up Supabase auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Wait for profile fetch but max 2 seconds to prevent hanging
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2000));
        try {
           await Promise.race([
             fetchUserProfile(session.user.id),
             timeoutPromise
           ]);
        } catch (e) {
           console.error("Profile fetch race error", e);
        }
      } else {
        setUserProfile(null);
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("user_profiles")
        .select("*, roles(*)")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      if (profileData) {
        setUserProfile(profileData);
        setUserRole(profileData.roles);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Error loading user profile");
    }
  };

  const checkExistingUser = async (email: string, phone: string) => {
    try {
      // Check email
      const { data: emailUser } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (emailUser) {
        return { exists: true, message: "Email already exists. Please login." };
      }

      // Check phone
      const { data: phoneUser } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

      if (phoneUser) {
        return {
          exists: true,
          message: "Phone number already exists. Please login.",
        };
      }

      return { exists: false };
    } catch (error) {
      console.error("Error checking existing user:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      // Straight to Supabase. Looking the profile up first needed every
      // profile to be readable by signed-out visitors.
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (/invalid login credentials/i.test(error.message)) {
          throw new Error("Email or password is incorrect.");
        }
        if (/email not confirmed/i.test(error.message)) {
          throw new Error("Please confirm your email first — check your inbox for the link we sent.");
        }
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user.id);
      }
      //const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      // Check if user exists
      // const existingUser = await checkExistingUser(data.email, data.phone);
      // if (existingUser.exists) {
      //   throw new Error(existingUser.message);
      // }

      // The profile row is made by the database (handle_new_user, on
      // auth.users), always as a customer, from this metadata. The browser
      // used to insert it and pick its own role.
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.name, phone: data.phone },
        },
      });

      if (authError) throw authError;
      //window.location.reload();
      return { error: null };
    } catch (error) {
      return { error };
    } finally {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    }
  };

  const signInWithPhone = async (phone: string) => {
    try {
      // For login, check if user exists (skip for signup)
      if (window.location.pathname !== "/signup") {
        const { data: userProfile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("phone", phone)
          .maybeSingle();

        if (!userProfile) {
          navigate("/signup");
          return {
            error: new Error("User not found. Please sign up."),
            verificationId: null,
          };
        }
      }

      // Always clear and re-create the verifier
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }

      // Remove any existing recaptcha container (prevents duplicate widgets)
      const existing = document.getElementById("recaptcha-container");
      if (existing) existing.innerHTML = "";

      // Create new verifier
      const verifier = new RecaptchaVerifier(
        auth, // auth instance first!
        "recaptcha-container", // container id
        {
          size: "invisible",
          callback: () => {},
          "expired-callback": () => {
            if (recaptchaVerifierRef.current) {
              recaptchaVerifierRef.current.clear();
              recaptchaVerifierRef.current = null;
            }
          },
        }
      );

      recaptchaVerifierRef.current = verifier;
      await verifier.render();

      const formattedPhone = phone.startsWith("+") ? phone : `+91${phone}`;
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(
        formattedPhone,
        verifier
      );

      // After sending, clear the verifier so resend works
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }

      return { verificationId, error: null };
    } catch (error) {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
      return { verificationId: null, error };
    }
  };

  const verifyOTP = async (verificationId: string, otp: string) => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };

  const value = {
    session,
    user,
    userProfile,
    userRole,
    loading,
    signInWithPhone,
    signInWithEmail,
    checkExistingUser,
    signUp,
    verifyOTP,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <div id="recaptcha-container"></div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
