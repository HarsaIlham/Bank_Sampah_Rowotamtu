// import React from 'react';
// import { useAuth } from '../../context/AuthContext';
// import { BankSampahService } from '../../services/bankSampahService';
// import { Users, Shield, User, RefreshCw } from 'lucide-react';
// import { Badge } from '../ui/Badge';

// export const QuickRoleSwitcher: React.FC = () => {
//   const { currentRole } = useAuth();
//   const allUsers = BankSampahService.getUsers();
//   const nasabahUsers = allUsers.filter(u => u.role === 'nasabah');

//   return (
//     <div className="bg-slate-900 text-white text-xs py-2 px-4 shadow-inner">
//       <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
//         <div className="flex items-center gap-2">
//           <span className="font-semibold text-pink-400 flex items-center gap-1.5">
//             <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Demo Mode Role Switcher:
//           </span>
//           <Badge variant={currentRole === 'admin' ? 'rose' : currentRole === 'nasabah' ? 'pink' : 'slate'} size="sm">
//             {currentRole === 'admin' ? 'Pengurus (Admin)' : currentRole === 'nasabah' ? `Nasabah (${currentUser?.name})` : 'Tamu (Warga)'}
//           </Badge>
//         </div>

//         <div className="flex items-center gap-1.5">
//           <button
//             onClick={() => switchRole('guest')}
//             className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
//               currentRole === 'guest' ? 'bg-pink-600 text-white font-medium' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
//             }`}
//           >
//             <User className="w-3 h-3" /> Warga (Guest)
//           </button>

//           <div className="relative group">
//             <button
//               className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
//                 currentRole === 'nasabah' ? 'bg-pink-600 text-white font-medium' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
//               }`}
//             >
//               <Users className="w-3 h-3" /> Login Nasabah ▾
//             </button>
//             <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1 min-w-[200px] z-50">
//               <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400">
//                 PILIH AKUN NASABAH
//               </div>
//               {nasabahUsers.map(user => (
//                 <button
//                   key={user.id}
//                   onClick={() => switchRole('nasabah', user.id)}
//                   className="w-full text-left px-3 py-2 hover:bg-pink-50 text-xs flex items-center justify-between"
//                 >
//                   <span className="font-medium text-slate-700">{user.name}</span>
//                   <span className="text-[10px] text-pink-600 font-mono">{user.nik}</span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <button
//             onClick={() => switchRole('admin')}
//             className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
//               currentRole === 'admin' ? 'bg-pink-600 text-white font-medium' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
//             }`}
//           >
//             <Shield className="w-3 h-3" /> Admin (Pengurus)
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
