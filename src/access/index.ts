import type { Access, FieldAccess } from 'payload'

type MaybeUser = { role?: string | null } | null | undefined

export const isLoggedIn: Access = ({ req }) => Boolean(req.user)
export const anyone: Access = () => true
export const isAdmin: Access = ({ req }) => (req.user as MaybeUser)?.role === 'admin'
export const isAdminField: FieldAccess = ({ req }) => (req.user as MaybeUser)?.role === 'admin'

/** Admins can manage everyone; other users can only read/update themselves. */
export const isAdminOrSelf: Access = ({ req }) => {
  const user = req.user as (MaybeUser & { id?: number | string }) | null
  if (!user) return false
  if (user.role === 'admin') return true
  return { id: { equals: user.id } }
}
