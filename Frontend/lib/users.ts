// Simple in-memory user store for demo purposes only.
// Do NOT use this in production. Replace with a real DB (Prisma, Supabase, etc.).

export type User = {
  id: string
  name?: string
  email: string
  password: string
}

export const users: User[] = []

export function addUser({ name, email, password }: Omit<User, "id">) {
  const id = Date.now().toString()
  const user: User = { id, name, email, password }
  users.push(user)
  return user
}

export function findUserByEmail(email?: string) {
  if (!email) return undefined
  return users.find((u) => u.email === email)
}
