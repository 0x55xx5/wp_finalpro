"use client";

import { AlertModal } from "@/components/modals/alert-modal";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@/app/generated/prisma";

import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
	name : z.string().min(1),
	value : z.string().min(4).regex(/^#/, {
		message: "String must be a Valid HEX Code"
	}),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
	initialData: Color | null;
}

export const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? "Edit Colors" : "Create Colors";
	const description = initialData ? "Edit a Colors" : "Add a New Colors";
	const toastMessage = initialData ? "Colors Updated" : "Colors Created";
	const action = initialData ? "Save Changes" : "Create";
	

	const form = useForm<ColorFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name : "",
			value : ""
		},
	});

	const onSubmit = async (data: ColorFormValues) => {
		try {
			setLoading(true);
			if(initialData) {
				await axios.patch(`/api/${params.storeId}/colors/${params.colorId}` , data);
			} else {
				await axios.post(`/api/${params.storeId}/colors` , data);
			}
			router.push(`/${params.storeId}/colors`)
			toast.success(toastMessage);
			router.refresh();
		} catch (error) {
			toast.error("Something went wrong.")
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
			router.push(`/${params.storeId}/colors`);
			toast.success("Color Deleted.");
			router.refresh();
		} catch (error) {
			toast.error("Make sure you removed all Products of this Color first.")
		} finally {
			setLoading(false);
			setOpen(false);
		}
	}

	return (
		<>
			<AlertModal 
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<div className="flex items-center justify-between">
				<Heading
					title={title}
					description={description}
				/>
				{initialData && (
					<Button
					disabled={loading}
					variant="destructive"
					size="icon"
					onClick={() => setOpen(true)}
					>
					<Trash className="h-4 w-4" />
				</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Color Name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="value"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Value</FormLabel>
									<FormControl>
										<div className="flex items-center gap-x-4">
											<Input
												disabled={loading}
												placeholder="Color Value"
												{...field}
											/>
											<div 
												className="border p-4 rounded-full"
												style={{ backgroundColor: field.value }}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button
						disabled={loading}
						className="ml-auto"
						type="submit"
					>
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};
