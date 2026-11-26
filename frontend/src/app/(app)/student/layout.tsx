'use client'

import React from 'react'
import { StudentWorkspaceProvider } from './StudentWorkspaceContext'

export default function StudentWorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StudentWorkspaceProvider>
      <div className="max-w-[1040px] mx-auto pb-16 animate-in">
        <main>{children}</main>
      </div>
    </StudentWorkspaceProvider>
  )
}
