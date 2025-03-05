// import { useState } from 'react';
// import { loginUser } from '@/services/index';
// import { LoginData } from '@/app/types/auth';

// export default function LoginForm() {
//     const [formData, setFormData] = useState<LoginData>({
//         email: '',
//         password: '',
//     });

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             const data = await loginUser(formData);
//             console.log('Login successful:', data);
//         } catch (error) {
//             console.error('Login error:', error);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input
//                 type="email"
//                 placeholder="Email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             />
//             <input
//                 type="password"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             />
//             <button type="submit">Login</button>
//         </form>
//     );
// }