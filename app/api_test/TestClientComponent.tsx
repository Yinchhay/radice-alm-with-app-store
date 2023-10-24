'use client'
import { useEffect, useState } from "react";
import Image from "next/image";
import { IsLogin } from "./isLogin";

export default function TestClientComponent() {
  const [users, setUsers] = useState<Record<string, string>[]>([]);
  const [user, setUser] = useState<any>();

  const createOneUser = async () => {
    await fetch('/api/auth/user/create', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: 'lucia3',
        email: 'lucia3@gmail.com',
        password: 'lucialucia3',
        phone_number: '012345678',
        roles: {
          id: 1,
        }
      })
    }).then(async res => {
      console.log(await res.json());
    });
  };

  const loginUser = async () => {
    await fetch('/api/auth/user/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: 'lucia3@gmail.com',
        password: 'lucialucia3',
      })
    }).then(async res => {
      console.log(await res.json());
    });
  };

  const logoutUser = async () => {
    await fetch('/api/auth/user/logout', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(async res => {
      console.log(await res.json());
    });
  };

  const getOneUser = async () => {
    await fetch('api/auth/user/get/taw709q0zkf4i4z').then(async res => {
      console.log(await res.json());
    });
  }

  const getAllUser = async () => {
    const res = await fetch('api/auth/user/get/all');
    const data = await res.json();
    if (data) {
      setUsers([...data.users]);
    }
  }

  useEffect(() => {
    getAllUser();
  }, []);

  const Users = users.map((user, index) => {
    return (
      <div key={index}>
        <h1>{user.username}</h1>
        <h1>{user.email}</h1>
      </div>
    )
  })

  return (
    <>
      <h1>Create user</h1>
      <button onClick={createOneUser} >create one user</button>
      <br></br>
      <button onClick={loginUser} >login one user</button>
      <br></br>
      <button onClick={logoutUser} >logout one user</button>
      <br></br>
      <button onClick={getOneUser} >getOneUser</button>
      <br></br>
      <a href="/api_test/project">go to project</a>

      {/* if connected with github, can login without using password */}
      {/* <div className="">
        <Image src={"https://cdn.icon-icons.com/icons2/2351/PNG/512/logo_github_icon_143196.png"} width={50} height={50} alt="logo"></Image>
        <a href="/api/user/login/github">connect with Github</a>
      </div> */}
      <div className="">
        {/* <IsLogin /> */}
      </div>

      <div className="">
        <br></br>
        <h1>User lists: </h1>
        {Users}
      </div>
    </>
  )
}
