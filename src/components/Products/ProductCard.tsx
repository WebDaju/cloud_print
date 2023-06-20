/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    CardFooter,
    Button,
  } from "@material-tailwind/react";
   
  interface productProps{
    id:number,
    name:string,
    description:string,
    image:string,
    price:number
  }

  export default function ProductCard({id,name,description,image,price}:productProps) {
    return (
      <Card className="w-60 m-auto">
        <CardHeader shadow={false} floated={false} className="h-52">
          <img 
            src={image}
            className="w-full h-full object-cover"
          />
        </CardHeader>
        <CardBody>
          <div className="flex  flex-col justify-between mb-2">
            <Typography color="blue-gray" className="font-medium">
              {name}
            </Typography>
            <Typography color="blue-gray" className="font-medium">
              Rs {price}
            </Typography>
          </div>
          <Typography variant="small" color="gray" className="font-normal opacity-75">
            {description}
          </Typography>
        </CardBody>
       
      </Card>
    );
  }