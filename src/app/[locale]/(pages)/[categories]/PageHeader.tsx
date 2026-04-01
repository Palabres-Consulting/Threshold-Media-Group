"use client";


import { usePathname } from 'next/navigation';
import React from 'react'

const PageHeader = () => {

    const path = usePathname();

  return (
    <div>PageHeader</div>
  )
}

export default PageHeader