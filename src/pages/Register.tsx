import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/api";
import heroBg from "@/assets/hero-bg.jpg";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await auth.register({ username, password, email });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            toast({
                title: "注册成功",
                description: "欢迎加入 iLinks！",
            });

            navigate('/admin');
        } catch (error: any) {
            toast({
                title: "注册失败",
                description: error.response?.data?.error || "注册过程中出现错误",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed relative flex items-center justify-center"
            style={{ backgroundImage: `url(${heroBg})` }}
        >
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10 w-full max-w-md p-8 glass-card rounded-xl">
                <h1 className="text-3xl font-bold text-white text-center mb-8 text-shadow">注册 iLinks</h1>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-white/80 text-sm">用户名</label>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            placeholder="至少3个字符"
                            required
                            minLength={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-white/80 text-sm">邮箱 (可选)</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            placeholder="example@email.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-white/80 text-sm">密码</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            placeholder="至少6个字符"
                            required
                            minLength={6}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        disabled={loading}
                    >
                        {loading ? "注册中..." : "注册"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-white/60 text-sm">
                        已有账号？{" "}
                        <Link to="/login" className="text-green-400 hover:text-green-300 hover:underline">
                            立即登录
                        </Link>
                    </p>
                    <div className="mt-2">
                        <Link to="/" className="text-white/40 text-xs hover:text-white/60">
                            返回首页
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
