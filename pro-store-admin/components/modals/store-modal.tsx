"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

// Defining the Form Schema and setting up Constrains with the help od using ZOD
const formSchema = z.object({
	name: z.string().min(1),
});

export const StoreModal = () => {
	const storeModal = useStoreModal();

	const [loading, setloading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			setloading(true);
			const response = await axios.post("api/stores", values);

			toast.success("Store Created");
			window.location.assign(`/${response.data.id}`);
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setloading(false);
		}
	};

	return (
		<Modal
			title="Create Store"
			
			isOpen={storeModal.isOpen}
			onClose={storeModal.onClose}
		>
			<div className="space-y-4 py-2 pb-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Shoppers"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="pt-6 space-x-2 flex items-center justify-end w-full">
							<Button
								disabled={loading}
								variant="outline"
								onClick={storeModal.onClose}
							>
								Cancel
							</Button>
							<Button disabled={loading} type="submit">
								Continue
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</Modal>
	);
};
