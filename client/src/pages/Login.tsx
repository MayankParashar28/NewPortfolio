import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { Redirect } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ShieldCheck, Check } from "lucide-react";
import { motion } from "framer-motion";

import { useToast } from "@/hooks/use-toast";


export default function Login() {
    const { user, loginMutation } = useAuth();
    const { toast } = useToast();

    // Auth State
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState<"ID" | "OTP">("ID");
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOtp = async () => {
        if (!phoneNumber) return;

        // IDENTITY VERIFICATION: Check for Secret ID
        const SECRET_ID = "parasharmayank";

        if (phoneNumber.trim().toLowerCase() !== SECRET_ID) {
            toast({
                title: "Access Denied",
                description: "Unauthorized identity. Access is restricted.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        setStep("OTP");
        setIsLoading(false);
        toast({
            title: "Identity Verified",
            description: "Please enter OTP sent to your E-Mail.",
        });
    };


    const handleVerifyOtp = async () => {
        if (!otp) return;
        setIsLoading(true);
        try {
            const SYSTEM_PIN = "756500";

            if (otp !== SYSTEM_PIN) {
                throw new Error("Invalid System PIN");
            }

            await loginMutation.mutateAsync({ username: "parasharmayank", password: "admin123" });

            toast({
                title: "Success",
                description: "Logged in successfully!",
            });
        } catch (error: any) {
            console.error("Error verifying:", error);
            toast({
                title: "Verification Failed",
                description: "Incorrect PIN entered.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (user) {
        return <Redirect to="/admin" />;
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden font-sans selection:bg-primary/30">
            {/* Subtle ambient gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/8 via-background to-background pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="z-10 w-full max-w-md px-6"
            >
                <Card className="relative bg-black/40 backdrop-blur-2xl border-white/10 shadow-[0_0_50px_-12px_rgba(var(--primary),0.25)] ring-1 ring-white/10 overflow-hidden">
                    {/* Top glass reflection highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50" />

                    <CardHeader className="text-center pb-6 pt-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                            className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-blue-600/10 rounded-2xl flex items-center justify-center mb-6 text-primary backdrop-blur-md border border-primary/20 shadow-[0_0_30px_-5px_rgba(var(--primary),0.3)]"
                        >
                            <ShieldCheck className="w-8 h-8 drop-shadow-lg" />
                        </motion.div>
                        <CardTitle className="text-3xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/60 tracking-tight">
                            Access Portfolio
                        </CardTitle>
                        <CardDescription className="text-muted-foreground/80 mt-2 text-base">
                            Secure login via system identity
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pb-8">
                        {step === "ID" ? (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80 ml-1">Secret Identity Key</label>
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-700"></div>
                                        <Input
                                            type="text"
                                            placeholder="Enter your identity key"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="relative bg-black/50 border-white/10 focus:border-primary/50 text-white placeholder:text-white/20 h-12 rounded-xl transition-all duration-300 pl-4 text-lg tracking-wide hover:bg-black/60 focus:bg-black/70"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground/60 ml-1 flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-primary/50" />
                                        Restricted access — authorised personnel only
                                    </p>
                                </div>
                                <Button
                                    onClick={handleSendOtp}
                                    className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white font-bold h-12 rounded-xl shadow-[0_4px_20px_-4px_rgba(var(--primary),0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_-4px_rgba(var(--primary),0.5)] mt-2 text-base"
                                    disabled={isLoading || !phoneNumber}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                                    Verify Identity
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80 ml-1">System PIN</label>
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-700"></div>
                                        <Input
                                            type="text"
                                            placeholder="abc123"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="relative bg-black/50 border-white/10 focus:border-green-500/50 text-white placeholder:text-white/20 h-12 rounded-xl text-center tracking-[0.5em] text-xl font-mono transition-all duration-300 hover:bg-black/60 focus:bg-black/70"
                                            maxLength={6}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground/60 ml-1 flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-green-500/50" />
                                        Enter the code sent to your mobile number
                                    </p>
                                </div>
                                <Button
                                    onClick={handleVerifyOtp}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold h-12 rounded-xl shadow-[0_4px_20px_-4px_rgba(16,185,129,0.3)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.5)] mt-2 text-base"
                                    disabled={isLoading || !otp}
                                >
                                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
                                    Verify & Login
                                </Button>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}


// End of file

