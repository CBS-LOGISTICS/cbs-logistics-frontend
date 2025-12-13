"use client"

import { useEffect, useState } from "react"
import { ChangePasswordModal } from "./ChangePasswordModal"

export function AdminAuthCheck() {
    const [mustChangePassword, setMustChangePassword] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Get token from localStorage if that's where it's stored
                // Assuming the fetch wrapper or interceptor handles the token
                // If not, we might need to manually add Authorization header
                const token = localStorage.getItem('authToken'); // Adjust key if needed
                const headers: HeadersInit = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch("/api/auth/me", {
                    headers
                })

                if (response.ok) {
                    const data = await response.json()
                    if (data.user?.mustChangePassword) {
                        setMustChangePassword(true)
                    }
                }
            } catch (error) {
                console.error("Failed to check auth status", error)
            }
        }

        checkAuth()
    }, [])

    return <ChangePasswordModal isOpen={mustChangePassword} />
}
