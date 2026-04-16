import { useEffect, useState } from 'react'
import type { User as UserType } from '../../types/User'
import axiosInstance from '../../utils/axiosClient'
import './profile.css'

const baseStorageUrl = "http://localhost:8080/storage/"

function Profile() {
    const [user, setUser] = useState<UserType | null>(null)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [form, setForm] = useState({ name: '', email: '', bio: '' })
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [saving, setSaving] = useState<boolean>(false)

    const fetchUser = async () => {
        try {
            const response = await axiosInstance.get('/user')
            const data = response.data
            setUser(data)
            setForm({ name: data.name ?? '', email: data.email ?? '', bio: data.bio ?? '' })
            if (data.avatar){
                setAvatarPreview(baseStorageUrl + data.avatar)
            }else{
                setAvatarPreview("")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void fetchUser()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        setAvatarFile(file)
        if (file) {
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    const handleProfileUpdate = async () => {
        setSaving(true)
        try {
            const formData = new FormData()
            formData.append('name', form.name)
            formData.append('email', form.email)
            formData.append('bio', form.bio)
            if (avatarFile) formData.append('avatar', avatarFile)
            // use method spoofing to ensure file upload works with Laravel PUT route
            formData.append('_method', 'PUT')

            const response = await axiosInstance.post('/user/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            setUser(response.data.user)
            setForm({ name: response.data.user.name ?? '', email: response.data.user.email ?? '', bio: response.data.user.bio ?? '' })
            if (response.data.user.avatar){
                setAvatarPreview(baseStorageUrl + response.data.user.avatar)
            }else{
                setAvatarPreview("")
            }
            setAvatarFile(null)
            setIsEditing(false)
        } catch (error) {
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="profile">Loading...</div>

    return (
        <div className="profile">
            <div className="profile-card">
                <div className="profile-avatar">
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" />
                    ) : (
                        <div className="avatar-placeholder">{user?.name?.charAt(0) ?? '?'}</div>
                    )}

                    {isEditing && (
                        <label className="avatar-upload">
                            <input type="file" accept="image/*" onChange={handleAvatarChange} />
                            Change
                        </label>
                    )}
                </div>

                <div className="profile-details">
                    {!isEditing && (
                        <>
                            <h2 className="profile-name">{user?.name}</h2>
                            <div className="profile-meta">{user?.email}</div>
                            <p className="profile-bio">{user?.bio}</p>
                            <div className="profile-actions">
                                <button className="btn" onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </button>
                            </div>
                        </>
                    )}

                    {isEditing && (
                        <div className="profile-form">
                            <label>
                                Name
                                <input name="name" value={form.name} onChange={handleChange} />
                            </label>
                            <label>
                                Email
                                <input name="email" value={form.email} onChange={handleChange} />
                            </label>
                            <label>
                                Bio
                                <textarea name="bio" value={form.bio} onChange={handleChange} />
                            </label>

                            <div className="profile-actions">
                                <button className="btn btn-primary" onClick={handleProfileUpdate} disabled={saving}>
                                    {saving ? 'Saving...' : 'Update'}
                                </button>
                                <button className="btn btn-ghost" onClick={() => setIsEditing(false)} disabled={saving}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile
