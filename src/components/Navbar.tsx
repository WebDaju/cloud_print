/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  MenuHandler,
  Menu,
  MenuList,
  MenuItem,
  Badge,
  Drawer,
  ListItem,
  List,
  Collapse,
} from "@material-tailwind/react";

import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {
  AiFillDelete,
  AiFillShopping,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks";
import Image from "next/image";
import { removeItem } from "@/store/cartSlice";

export default function Example() {
  const [openNav, setOpenNav] = React.useState(false);
  const router = useRouter();
  const cartItems = useAppSelector((state) => state.cart.items);
  const userLogoutHandler = async () => {
    await signOut({ callbackUrl: "http://localhost:3000" });

    toast.success("Logout Successfully");
  };
  const dispatch = useAppDispatch();
  const userLoginHandler = async () => {
    await router.push("/auth/login");
  };
  const deleteCartItemsHandler = (id: any) => {
    console.log(id);
    dispatch(removeItem(id));
  };

  const [open, setOpen] = React.useState(false);
  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  const { data: session } = useSession();

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link href="/" className="flex items-center">
          Home
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link href="/products" className="flex items-center">
          Products
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link href="/about" className="flex items-center">
          About Us
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link href="/contact" className="flex items-center">
          Contact Us
        </Link>
      </Typography>
      <div>
        <Badge content={`${cartItems?.length}`} color="red" className="h-1 w-1">
          <IconButton
            ripple={true}
            variant="outlined"
            className="border-none"
            onClick={openDrawer}
          >
            <AiFillShopping className="h-5 w-5" />
          </IconButton>
        </Badge>
      </div>

      {session?.user ? (
        ""
      ) : (
        <Button color="red" onClick={userLoginHandler}>
          Login
        </Button>
      )}
    </ul>
  );

  function ProfileMenu() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    return (
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-1 rounded-full py-0.5 pl-0.5 pr-2 lg:ml-auto"
          >
            <Avatar
              variant="circular"
              size="sm"
              alt="candice wu"
              className="border border-blue-500 p-0.5"
              src={session?.user?.image || ""}
            />
          </Button>
        </MenuHandler>

        <MenuList className="p-1">
          return (
          <MenuItem
            onClick={() => {
              router.push(`/user/order/${session?.user?.id}`);
            }}
          >
            <Typography>Track My Order</Typography>
          </MenuItem>
          <MenuItem onClick={userLogoutHandler}>
            <Typography
              as="span"
              variant="small"
              className="flex gap-2 font-normal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              LogOut
            </Typography>
          </MenuItem>
          );
        </MenuList>
      </Menu>
    );
  }
  return (
    <>
      <Navbar className="sticky inset-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Link href={"/"}>
            <Typography className="mr-4 cursor-pointer py-1.5 font-medium">
              Cloud Print
            </Typography>
          </Link>

          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>

            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
            <ProfileMenu />
          </div>
        </div>
        <Collapse open={openNav}>{navList}</Collapse>
      </Navbar>

      <Drawer
        open={open}
        onClose={closeDrawer}
        placement="right"
        style={{
          width: "100%",
          border: "2px solid red",
        }}
      >
        <List className="h-full w-full">
          <div className="flex items-center justify-center gap-10 p-5">
            <h1 className=" text-xl font-bold ">Items In Cart</h1>
            <AiOutlineShoppingCart color="red" size={25} />
          </div>
          {cartItems?.map((item, i) => (
            <>
              <ListItem onClick={closeDrawer} key={i} className="mt-5 border-2">
                <div className="flex w-full items-center justify-between p-4 ">
                  <div className="flex items-center gap-3">
                    <Image
                      height={50}
                      width={50}
                      src={item?.product?.image || ""}
                      alt="productImage"
                    />
                    <p className="text-sm">{item?.product?.name || ""}</p>
                  </div>
                  <div>
                    <h6>{item?.product?.price || ""}</h6>
                  </div>

                  <div
                    className="cursor-pointer"
                    onClick={deleteCartItemsHandler.bind(
                      null,
                      item?.product?.id
                    )}
                  >
                    <AiFillDelete color="red" />
                  </div>
                </div>
              </ListItem>
            </>
          ))}
          <div className="mb-5 p-2">
            <Button
              variant="filled"
              className="my-5"
              fullWidth
              onClick={() => {
                router.push("/user/makeorder");
              }}
            >
              Make Order
            </Button>
          </div>
        </List>
      </Drawer>
    </>
  );
}
