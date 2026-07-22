import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { registerSchema } from "@/schema/registerSchema"
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

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "@/store/auth/authActions"
import { AlertCircleIcon, Loader } from "lucide-react"
import { useState, useEffect } from "react"
import { usePageTitle } from "@/hooks/usePageTitle";
import { resetAuthError } from "@/store/auth/authSlice"

export default function Register() {
    usePageTitle("Create account");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authError = useSelector((state) => state.auth.error);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        }
    })

    const onSubmit = async (data) => {
        setLoading(true);
        dispatch(resetAuthError())
        try {
            await dispatch(registerUser(data));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }

        return () => {
            dispatch(resetAuthError());
        }
    }, [isAuthenticated, navigate]);

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen p-2 border-2 w-full ">
                <Card className="sm:max-w-sm sm:w-full w-full sm:px-4 px-2 py-8">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Register</CardTitle>
                        <CardDescription>
                            Create an account to get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {authError && (<Alert variant="destructive" className="my-3">
                            <AlertCircleIcon />
                            <AlertTitle>Registration failed</AlertTitle>
                            <AlertDescription className="text-sm">
                                {authError || "An error occurred during registration."}
                            </AlertDescription>
                        </Alert>)}
                        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Controller
                                    name="firstName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-demo-title">
                                                First Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-demo-title"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Akber"
                                                autoComplete="off"
                                                className="h-9"
                                                type="text"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="lastName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-demo-title">
                                                Last Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-demo-title"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Ali"
                                                autoComplete="off"
                                                className="h-9"
                                                type="text"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
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
                                                type="email"
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
                                    {loading ? <Loader className="animate-spin" /> : "Register"}
                                </Button>
                            </FieldGroup>
                        </form>
                        <Marker variant="separator" className="my-4">
                            <MarkerContent>OR</MarkerContent>
                        </Marker>
                        <p className="text-sm text-center">
                            Already have an account? <Link to="/login" className="hover:underline">
                                Login
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
