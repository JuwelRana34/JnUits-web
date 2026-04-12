"use client";

import { useAuth } from "@/components/features/AuthProvider";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useTransition } from "react";

export default function SSLPAY({title, id}:{
    title:string, id:string
}) {

  const {user}= useAuth();
  const [isPending, startTransition] = useTransition();
  
  const handelSSlPay = async () => {

  startTransition(async () => {
      try{
      const response = await fetch('/api/init', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    eventId: id,
    productName: title,
    UserId: user?.id || '',
    CustomerName: user?.name || '',
    CustomerEmail: user?.email || '',
    CustomerPhone: "01711111111"
  })
});

const result = await response.json();

if (result.gatewayUrl) {
  window.location.href = result.gatewayUrl;
  console.log( result.gatewayUrl);
} else {
  console.error("Payment failed:", result.error);
}
      
    } catch (error) {
      console.error("Error occurred while initiating SSLCommerz payment:", error);
    }
    });
    
  }

  console.log(user);

  return (
    <Button className="w-full my-2 bg-blue-500 hover:bg-blue-600 text-white" onClick={handelSSlPay} disabled={isPending}>
                 {isPending ? <><Loader className=" animate-spin" /> Processing...</>  : "Pay with sslcommerz"}
                </Button>
  )
}
