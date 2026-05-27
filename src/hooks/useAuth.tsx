import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => void;
  register: (email: string, pass: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // invalid stored json
      }
    }
  }, []);

  const getRegisteredUsers = () => {
    const usersStr = localStorage.getItem('bup_registered_users');
    return usersStr ? JSON.parse(usersStr) : {};
  };

  const login = (email: string, pass: string) => {
    const users = getRegisteredUsers();
    const existingUser = users[email.toLowerCase()];
    
    if (!existingUser) {
      throw new Error("No account found with this email. Please register first.");
    }
    if (existingUser.password !== pass) {
      throw new Error("Incorrect password.");
    }

    const authUser = { email: existingUser.email, name: existingUser.name };
    setUser(authUser);
    localStorage.setItem('auth_user', JSON.stringify(authUser));
  };

  const register = (email: string, pass: string, name: string) => {
    const users = getRegisteredUsers();
    const normalizedEmail = email.toLowerCase();
    
    if (users[normalizedEmail]) {
      throw new Error("An account with this email already exists.");
    }

    users[normalizedEmail] = { email: normalizedEmail, password: pass, name };
    localStorage.setItem('bup_registered_users', JSON.stringify(users));

    const authUser = { email: normalizedEmail, name };
    setUser(authUser);
    localStorage.setItem('auth_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

