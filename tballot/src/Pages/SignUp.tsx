import { Label } from "@/components/ui/8bit/label"
import { Button } from "@/components/ui/8bit/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/8bit/card"
import { Input } from "@/components/ui/8bit/input"
import { useState, type ChangeEvent, type FormEvent } from "react"
import { toast } from "@/components/ui/8bit/toast"
import { useNavigate } from "react-router-dom"
import { ScatterBoxLoader } from "react-awesome-loaders";
import bg from "../assets/background.jpg";
import { API_ENDPOINTS } from "../config/api";


interface SignUpForm {
    name: string,
    email: string,
    password: string
}

const SignUp = () => {
    let navigate = useNavigate();


    const [formData, setFormData] = useState<SignUpForm>({
        name: "",
        email: "",
        password: ""
    })


    const [Loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(API_ENDPOINTS.SIGNUP, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            const data = await res.json();

            if (res.ok) {
                toast(data.message || "Sign Up Successful");
                setFormData({ name: "", email: "", password: "" })
                setTimeout(() => {
                    setLoading(false);
                    navigate("/menu");
                }
                    , 3000)
            } else {
                // Handle error response
                toast(data.message || "Error during sign up");
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setFormData({ name: "", email: "", password: "" })
            toast("Error during sign up");
            setLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen p-4" style={Loading ? {} :{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {Loading ? <div className="flex justify-center items-center h-40 ">
                <ScatterBoxLoader/>
            </div> : <Card className="w-full max-w-[490px] mx-auto">
                <CardHeader>
                    <Label className="text-xl sm:text-2xl font-semibold flex justify-center items-center">
                        Sign Up
                    </Label>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 sm:gap-4">
                            <Label className="text-sm sm:text-base font-bold sm:w-2xs">FullName</Label>
                            <Input
                                name="name"
                                type="text"
                                placeholder="Enter ur FullName"
                                required
                                onChange={handleChange}
                                className="w-full sm:w-[450px]"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 sm:gap-4 m-2 sm:m-4">
                            <Label className="text-sm sm:text-base font-bold sm:w-3xs">Email</Label>
                            <Input
                                name="email"
                                type="email"
                                placeholder="Enter ur Email"
                                required
                                onChange={handleChange}
                                className="w-full sm:w-[450px]"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-2 sm:gap-4">
                            <Label className="text-sm sm:text-base font-bold sm:w-3xs">Password</Label>
                            <Input
                                name="password"
                                type="password"
                                placeholder="Enter ur Password"
                                required
                                onChange={handleChange}
                                className="w-full sm:w-[450px]"
                            />
                        </div>

                        <CardFooter className="flex justify-center items-center pt-4">
                            <Button type="submit" className="w-full sm:w-auto">Sign Up</Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>}

        </div>

    )
}

export default SignUp