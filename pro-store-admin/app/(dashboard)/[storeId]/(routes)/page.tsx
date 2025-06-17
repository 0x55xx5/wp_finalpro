"use client"
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import styled from 'styled-components';
 
// This creates a custom component that wraps an <a> tag
const RedLink = styled.a`
  color: gray;
`


const DashboardPage = () => {
	return <div>
		<h1 className="text-2xl font-bold">Dashboard</h1>
		<p className="text-muted-foreground">
			可以建立多個商店每個商店可以有不同設定
		</p>
		<Separator className="my-4" />
		<h2 className="text-xl font-semibold">功能概覽</h2>
		<ul className="list-disc pl-5 mt-2">
			<li>Banner/Product 使用課堂uploading 上傳元件</li>
			<li>擷取資料使用ＡＰＩ</li>
			<li>CRUD商品支援屬性維度colors sizes</li>
			<li>登入使用ＣＬＥＲＫ進行身份驗證，上傳api改寫成ＣＬＥＲＫ保護
			<Link href="https://clerk.com/docs/quickstarts/nextjs" passHref legacyBehavior>
      <RedLink>https://clerk.com/docs/quickstarts/nextjs</RedLink>
    </Link></li>
	<li> </li>
		</ul>

	</div>;
};

export default DashboardPage;
