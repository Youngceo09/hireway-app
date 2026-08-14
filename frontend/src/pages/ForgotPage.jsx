export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const handleForgot = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
    alert("Check your Gmail for the reset link!");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-[2rem] shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-black mb-4">Forgot Password?</h2>
        <input placeholder="Enter your email" className="w-full p-4 border rounded-xl mb-4" onChange={(e)=>setEmail(e.target.value)} />
        <button onClick={handleForgot} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">Send Reset Link</button>
      </div>
    </div>
  );
}