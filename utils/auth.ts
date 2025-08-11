import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'current_user';

export async function saveToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du token:', error);
    throw error;
  }
}

export async function getToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
}

export async function removeToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression du token:', error);
    throw error;
  }
}

export async function saveUser(user: any): Promise<void> {
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<any | null> {
  try {
    const userData = await SecureStore.getItemAsync(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  return token !== null;
}

export async function getUserRole(): Promise<'admin' | 'user' | null> {
  try {
    const user = await getCurrentUser();
    return user?.role || null;
  } catch (error) {
    console.error('Erreur lors de la récupération du rôle:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  try {
    await removeToken();
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
}
