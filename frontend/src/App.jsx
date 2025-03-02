import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignUpPage from "./pages/auth/SignUpPage";
import toast, { Toaster } from "react-hot-toast";
import { useQuery , QueryClient } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";

const App = () => {

	//Implementing Protected Routes
	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await axiosInstance.get("/auth/me");
				return res.data;
			} catch (err) {
				if (err.response && err.response.status === 401) {
					return null; // Explicitly return null for unauthorized users
				}
				toast.error(err.response?.data?.message || "Something went wrong");
				return null; // Ensure a value is always returned
			}
		},
	});
	console.log("Auth User ", authUser);
	if (isLoading) return null;

	return <Layout>
		<Routes>
			<Route path='/' element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
			<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} />
			<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
		</Routes>
		<Toaster />
	</Layout>
}

export default App
