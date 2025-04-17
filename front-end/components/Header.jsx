'use client';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar';
import { User } from '@heroui/user';
import { useEffect } from 'react';

export default function Header({ isAuthenticated, user, onLogout }) {
  useEffect(() => {
    console.log(user)
  }, [])

  return (
    <Navbar>
      <NavbarBrand>
        <h1 className="text-2xl font-bold">Todo App</h1>
      </NavbarBrand>
      {
        isAuthenticated && (
          <NavbarContent justify="end">
            <NavbarItem>
              <Dropdown>
                <DropdownTrigger>
                  <User
                    avatarProps={{
                      src: "https://i.pravatar.cc/",
                    }}
                    description={user?.email}
                    name={user?.username}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem onPress={onLogout} key="logout" className="text-danger" color="danger">
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </NavbarContent>
        )
      }
    </Navbar>
  );
}