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
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@/app/generated/prisma";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { UploadButton } from '@/lib/uploadthing';
import Image from 'next/image';
const formSchema = z.object({
	label : z.string().min(1),
	imageURL : z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
	initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();

	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? "Edit Banner" : "Create Banner";
	const description = initialData ? "Edit a Banner" : "Add a New Banner";
	const toastMessage = initialData ? "Banner Updated" : "Banner Created";
	const action = initialData ? "Save Changes" : "Create";
	

	const form = useForm<BillboardFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			label : "",
			imageURL : ""
		},
	});

	const onSubmit = async (data: BillboardFormValues) => {
		try {
			setLoading(true);
			if(initialData) {
				await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}` , data);
			} else {
				await axios.post(`/api/${params.storeId}/billboards` , data);
			}
			router.push(`/${params.storeId}/billboards`)
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
			await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
			router.push(`/${params.storeId}/billboards`);
			toast.success("Billboard Deleted.");
			router.refresh();
		} catch (error) {
			toast.error("Make sure you removed all categories using this Billboard first.")
		} finally {
			setLoading(false);
			setOpen(false);
		}
	}
  	const imageURL = form.watch('imageURL');
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
					<FormField
						control={form.control}
							name="imageURL"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Background Image</FormLabel>
									{/* <FormControl>
										<ImageUpload
											value={field.value ? [field.value] : [] }
											disabled={loading}
											onChange={(url) => field.onChange(url)}
											onRemove={() => field.onChange("")}
										/>
									</FormControl> */}
									<Image
										key={imageURL}
										src={imageURL}
										alt='product image'
										className='w-20 h-20 object-cover object-center rounded-sm'
										width={100}
										height={100}
									/>
									<FormControl>
										 <UploadButton
												endpoint='imageUploader'
												onClientUploadComplete={(res: { url: string }[]) => {
													form.setValue('imageURL', res[0].url);
												}}
												onUploadError={(error: Error) => {
													toast({
													variant: 'destructive',
													description: `ERROR! ${error.message}`,
													});
												}}
												/>
									</FormControl>
									<FormMessage />
								</FormItem>
						)}
					/>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="label"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Label</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Banner Label"
											{...field}
										/>
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
