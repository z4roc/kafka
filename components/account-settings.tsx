"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { db, storage } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Save,
  Loader2,
  User,
  Mail,
  School,
  BookOpen,
  X,
} from "lucide-react";
import { useAuthStore } from "@/hooks/auth_hook";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { schools } from "./onboarding-flow";
import { toast } from "sonner";
import { studyFields } from "@/types/types";

export function AccountSettings() {
  const { user, loading, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    displayName: "",
    schoolName: "",
    studyField: "",
  });

  useEffect(() => {
    if (user) {
      fetchuser();
    }
  }, [user]);

  const fetchuser = async () => {
    if (!user) return;

    setFormData({
      displayName: user.displayName || "",
      schoolName: user.schoolName || "",
      studyField: user.studyField || "",
    });

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const updatedData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      // Update Firestore
      await updateDoc(doc(db, "users", user.uid), updatedData);
      toast.success("Account settings updated successfully!");
      setMessage({
        type: "success",
        text: "Account settings updated successfully!",
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Failed to update account settings");
      setMessage({ type: "error", text: "Failed to update account settings" });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select a valid image file" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image size must be less than 5MB" });
      return;
    }

    setIsUploadingAvatar(true);
    setMessage(null);

    try {
      const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      // Update in Firestore
      await updateDoc(doc(db, "users", user.uid), {
        avatarUrl: downloadURL,
        updatedAt: new Date().toISOString(),
      });
      setUser({ ...user, avatarUrl: downloadURL });
      setMessage({ type: "success", text: "Avatar updated successfully!" });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setMessage({ type: "error", text: "Failed to upload avatar" });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
  };

  const removeAvatar = async () => {
    if (!user) return;

    setIsUploadingAvatar(true);
    setMessage(null);

    // TODO: Implement avatar removal logic
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          Please sign in to view account settings.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account information and preferences
        </p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Update your personal information and avatar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={user.avatarUrl || ""}
                  alt={user.displayName || "User Avatar"}
                />
                <AvatarFallback className="text-lg">
                  {user.displayName ||
                    "User Test"
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {user.avatarUrl ? "Change Avatar" : "Upload Avatar"}
                </Button>
                {user.avatarUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeAvatar}
                    disabled={isUploadingAvatar}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-500">
                JPG, PNG or GIF. Max size 5MB.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Display Name
              </label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) =>
                  handleInputChange("displayName", e.target.value)
                }
                placeholder="Enter your display name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                value={user.email || ""}
                disabled
                className="bg-gray-50 dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500">
                Email cannot be changed from this page
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="schoolName" className="text-sm font-medium">
                School Name
              </label>

              <Select
                onValueChange={(value) =>
                  handleInputChange("schoolName", value)
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue
                    defaultValue={user.schoolName}
                    placeholder={user.schoolName}
                  />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="studyField" className="text-sm font-medium">
                Field of Study
              </label>
              <Select
                onValueChange={(value) =>
                  handleInputChange("studyField", value)
                }
              >
                <SelectTrigger className="h-12">
                  <SelectValue
                    defaultValue={formData.studyField}
                    placeholder={formData.studyField}
                  />
                </SelectTrigger>
                <SelectContent>
                  {studyFields.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            View your account details and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Status</span>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Onboarding</span>
                <Badge
                  variant={user.onboardingCompleted ? "default" : "secondary"}
                  className={
                    user.onboardingCompleted
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : ""
                  }
                >
                  {user.onboardingCompleted ? "Completed" : "Pending"}
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(
                    user.createdAt || new Date().toISOString()
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(
                    user.updatedAt || new Date().toISOString()
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Academic Information
          </CardTitle>
          <CardDescription>Your educational details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Institution</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {user.schoolName}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Field of Study</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {user.studyField}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
