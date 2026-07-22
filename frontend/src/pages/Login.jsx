import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { loginSchema } from "@/schema/loginSchema"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "@/store/auth/authActions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Login() {
    usePageTitle("Log in");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authError = useSelector((state) => state.auth.error);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = (data) => {
        setLoading(true);
        dispatch(loginUser(data)); // send the data to login function
        setLoading(false);
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen p-2 border-2 w-full">
                <Card className="sm:max-w-sm sm:w-full w-full sm:px-4 px-2 py-8">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Login</CardTitle>
                        <CardDescription>
                            Sign in to your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {authError && (<Alert variant="destructive" className="my-3">
                            <AlertCircleIcon />
                            <AlertTitle>Login failed</AlertTitle>
                            <AlertDescription className="text-sm">
                                {authError || "An error occurred during login."}
                            </AlertDescription>
                        </Alert>)}
                        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-demo-title">
                                                Email
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-demo-title"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="akber@ali.com"
                                                autoComplete="off"
                                                className="h-9"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-demo-title">
                                                Password
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-demo-title"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="••••••••"
                                                autoComplete="off"
                                                type="password"
                                                className="h-9"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Button type="submit" className="h-9" disabled={loading}>
                                    {loading ? <Loader className="animate-spin" /> : "Login"}
                                </Button>
                            </FieldGroup>
                        </form>
                        <Marker variant="separator" className="my-4">
                            <MarkerContent>OR</MarkerContent>
                        </Marker>
                        <p className="text-sm text-center">
                            Don't have an account? <Link to="/register" className="hover:underline">
                                Register
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
