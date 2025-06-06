export const registerUser = async (
  email: string,
  password: string
) {
  return createUserWithEmailAndPassword(auth, email, password);
};
