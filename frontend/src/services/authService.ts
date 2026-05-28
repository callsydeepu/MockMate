import apiClient from "./apiClient";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  headline?: string;
  joinedDate: string;
}

interface AuthApiResponse {
  token: string;
  user: {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt?: string;
  };
}

const normalizeUser = (user: AuthApiResponse['user']): AuthUser => ({
  id: user.id || user._id || '',
  name: user.name,
  email: user.email,
  avatarUrl: user.avatar,
  joinedDate: user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
});

export const authService = {

  // LOGIN
  login: async (
    email: string,
    password: string
  ) => {

    const response = await apiClient.post<AuthApiResponse>(
      "/auth/login",
      {
        email,
        password,
      }
    );

    return {
      token: response.data.token,
      user: normalizeUser(response.data.user),
    };
  },

  // SIGNUP
  signup: async (
    name: string,
    email: string,
    password: string
  ) => {

    const response = await apiClient.post<AuthApiResponse>(
      "/auth/register",
      {
        name,
        email,
        password,
      }
    );

    return {
      token: response.data.token,
      user: normalizeUser(response.data.user),
    };
  },

  // GET CURRENT USER
  getCurrentUser: async () => {

    try {

      const response = await apiClient.get<AuthApiResponse['user']>(
        "/auth/me"
      );

      return normalizeUser(response.data);

    } catch {

      return null;

    }
  },
};