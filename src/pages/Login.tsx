import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/api";
import heroBg from "@/assets/hero-bg.jpg";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await auth.login({ username, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            toast({
                title: "登录成功",
                description: "欢迎回来！",
            });

            navigate('/admin');
        } catch (error: any) {
            toast({
                title: "登录失败",
                description: error.response?.data?.error || "请检查用户名和密码",
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
                <h1 className="text-3xl font-bold text-white text-center mb-8 text-shadow">登录 iLinks</h1>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-white/80 text-sm">用户名/邮箱</label>
                        <Input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            placeholder="请输入用户名或邮箱"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-white/80 text-sm">密码</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                            placeholder="请输入密码"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={loading}
                    >
                        {loading ? "登录中..." : "登录"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-white/60 text-sm">
                        还没有账号？{" "}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 hover:underline">
                            立即注册
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

export default Login;
