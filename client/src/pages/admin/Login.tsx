import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Lock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  username: z.string().min(1, "Username required"),
  password: z.string().min(1, "Password required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginValues) => apiRequest("POST", "/api/admin/login", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      navigate("/admin");
    },
    onError: () => {
      toast({ title: "Login failed", description: "Invalid username or password.", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-foreground mb-4">
            <Lock size={20} className="text-background" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">Portfolio Dashboard</p>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((d) => mutation.mutate(d))}
              className="flex flex-col gap-5"
              data-testid="admin-login-form"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="admin" {...field} className="rounded-xl" data-testid="input-username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="rounded-xl" data-testid="input-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-foreground text-background font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                data-testid="button-login"
              >
                {mutation.isPending ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </Form>
          <p className="text-xs text-center text-muted-foreground mt-4">
            Default: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
