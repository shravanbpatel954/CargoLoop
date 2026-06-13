import { useEffect, useState } from 'react'
import { Users, UserX, ShieldAlert, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { getUsers, updateUserRole } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function UserManagement() {
  const { role } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole)
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u))
    } catch (err) {
      console.error(err)
      alert("Failed to update user role")
    }
  }

  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center p-8 bg-red-500/10 rounded-2xl border border-red-500/20 max-w-md">
          <ShieldAlert className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
               <Users size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white heading-font">User Management</h1>
          </div>
          <p className="text-slate-400">Oversee all registered shippers, carriers, and administrators.</p>
        </div>
      </header>

      {loading ? (
        <p className="text-slate-500">Loading users...</p>
      ) : (
        <div className="overflow-x-auto bg-slate-900/50 rounded-2xl border border-slate-800">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs uppercase bg-slate-900/80 text-slate-500 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Current Role</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr 
                  key={u._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-brand-400 font-bold text-xs">
                      {u.name?.charAt(0)?.toUpperCase()}
                    </div>
                    {u.name}
                  </td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      u.role === 'carrier' ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' :
                      u.role === 'shipper' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => handleRoleChange(u._id, 'admin')}
                        className="text-xs font-bold text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 px-3 py-1.5 rounded-lg border border-purple-500/20 transition-colors"
                      >
                        Make Admin
                      </button>
                    )}
                    {u.role !== 'suspended' && (
                      <button 
                        onClick={() => handleRoleChange(u._id, 'suspended')}
                        className="text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors inline-flex items-center gap-1"
                      >
                        <UserX size={14} /> Suspend
                      </button>
                    )}
                    {u.role === 'suspended' && (
                      <button 
                        onClick={() => handleRoleChange(u._id, 'shipper')}
                        className="text-xs font-bold text-green-400 hover:text-green-300 bg-green-500/10 hover:bg-green-500/20 px-3 py-1.5 rounded-lg border border-green-500/20 transition-colors inline-flex items-center gap-1"
                      >
                        <ShieldCheck size={14} /> Reactivate
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
