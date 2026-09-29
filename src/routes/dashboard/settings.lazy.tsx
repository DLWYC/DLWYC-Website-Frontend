import { createLazyFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Pencil, Loader2, ImageUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Churches from "@/data/churches";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import UserProfileImage from "@/components/UserProfileImage";
import {
  useProfileImageUploader,
  useUpdateProfile,
} from "@/features/dashboard/hooks/useProfileUpdate";

export const Route = createLazyFileRoute("/dashboard/settings")({
  component: RouteComponent,
});

const inputCls =
  "w-full pl-2 pr-4 py-2.5 text-[13px] bg-transparent outline-none rounded-lg text-gray-800 appearance-none placeholder:text-gray-400";
const selectCls =
  "w-full pl-2 pr-4 py-2.5 text-[13px] bg-transparent outline-none rounded-lg text-gray-800 appearance-none cursor-pointer disabled:cursor-not-allowed disabled:text-gray-400";

function InputWrapper({
  error,
  children,
}: {
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex items-center border rounded-lg transition-all 
        ${
          error
            ? "border-red-400 bg-red-50 focus-within:ring-2 focus-within:ring-red-100"
            : "border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400"
        }`}
    >
      {children}
    </div>
  );
}

interface BasicInformation {
  fullName: string;
  age: string;
  archdeaconry: string;
  parish: string;
  gender: string;
  family: string;
  occupation: string;
  email: string;
}

function RouteComponent() {
  const { data: user } = useAuthUser();

  const [avatarUrl, setAvatarUrl] = useState(user?.profilePicture);

  const [basicInfo, setBasicInfo] = useState<BasicInformation>(user);
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 bg-white rounded-[10px] font-rubik">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal and job information.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <ProfileSummaryCard
          fullName={basicInfo.fullName}
          avatarUrl={avatarUrl}
          onAvatarChange={setAvatarUrl}
        />

        <Card>
          <CardContent className="p-4 sm:p-6">
            <BasicInformationForm value={basicInfo} onChange={setBasicInfo} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileSummaryCard({
  fullName,
  // occupation,
  avatarUrl,
  onAvatarChange,
}: {
  fullName: string;
  // occupation: string;
  avatarUrl: string;
  onAvatarChange: (url: string) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Card className="h-fit">
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center ">
        <div className="relative">
          <UserProfileImage imageWidth={70} />
          <Button
            type="button"
            size="icon"
            className="absolute bottom-0 right-0 h-8 w-8 cursor-pointer rounded-full shadow bg-white text-primary-main hover:text-white"
            aria-label="Edit profile photo"
            onClick={() => setDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <div>
          <p className="text-base font-semibold">{fullName}</p>
          {/* <p className="text-sm text-muted-foreground">{occupation}</p>  */}
        </div>

        <Badge variant="secondary" className="mt-1">
          {/* Standard Member */}
        </Badge>
      </CardContent>

      <EditAvatarDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentAvatarUrl={avatarUrl}
        onUploaded={onAvatarChange}
      />
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Edit avatar dialog — only changes the profile image
// ---------------------------------------------------------------------------

function EditAvatarDialog({
  open,
  onOpenChange,
  currentAvatarUrl,
  onUploaded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatarUrl: string;
  onUploaded: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: uploadAvatar, isPending: isUploading } =
    useProfileImageUploader();

  function resetState() {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  }

  async function handleSubmit() {
    if (!selectedFile) return;

    setError(null);

    try {
      const response = await uploadAvatar(selectedFile);

      onUploaded(response.url);

      onOpenChange(false);
      resetState();
    } catch (err) {
      console.error("Avatar upload error:", err);

      setError("Something went wrong while uploading. Please try again.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) resetState();
      }}
    >
      <DialogContent className="sm:max-w-sm bg-white font-rubik">
        <DialogHeader>
          <DialogTitle>Change profile photo</DialogTitle>
          <DialogDescription>
            Upload a new photo. This only updates your profile picture.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          <Avatar className="h-28 w-28">
            <AvatarImage
              src={previewUrl ?? currentAvatarUrl}
              alt="Avatar preview"
            />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 rounded-xl bg-[#091e54] py-3.5 text-sm font-medium text-white transition hover:bg-[#0d2a72] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#091e54]/40 cursor-pointer"
          >
            <ImageUp className="mr-2 h-4 w-4" />
            {selectedFile ? "Choose a different photo" : "Choose a photo"}
          </Button>

          {selectedFile && (
            <p className="text-xs text-muted-foreground">{selectedFile.name}</p>
          )}

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Basic Information form
// ---------------------------------------------------------------------------

function BasicInformationForm({
  value,
  onChange,
}: {
  value: BasicInformation;
  onChange: (value: BasicInformation) => void;
}) {
  const { mutate, isPending } = useUpdateProfile();

  // Parishes are scoped to whichever archdeaconry is currently selected.
  const parishOptions =
    Churches.find((group) => group.archdeaconry === value.archdeaconry)
      ?.churches ?? [];

  function update<K extends keyof BasicInformation>(
    key: K,
    fieldValue: BasicInformation[K],
  ) {
    onChange({ ...value, [key]: fieldValue });
  }

  function handleSave() {
    // Simply pass the current form state into the mutation
    mutate(value);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="fullName">
          <InputWrapper>
            <input
              id="fullName"
              value={value.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              className={inputCls}
            />
          </InputWrapper>
        </Field>

        <Field label="Age" htmlFor="age">
          <InputWrapper>
            <input
              id="age"
              type="number"
              min={0}
              className={inputCls}
              value={value.age}
              onChange={(e) => update("age", e.target.value)}
            />
          </InputWrapper>
        </Field>

        <Field label="Archdeaconry" htmlFor="archdeaconry">
          <InputWrapper>
            <select
              id="archdeaconry"
              name="archdeaconry"
              value={value.archdeaconry}
              onChange={(e) =>
                onChange({ ...value, archdeaconry: e.target.value, parish: "" })
              }
              className={selectCls}
            >
              <option value="">Select archdeaconry</option>
              {Churches.map((group) => (
                <option key={group.id} value={group.archdeaconry}>
                  {group.archdeaconry}
                </option>
              ))}
            </select>
          </InputWrapper>
        </Field>

        <Field label="Parish" htmlFor="parish">
          <InputWrapper>
            <select
              id="parish"
              name="parish"
              value={value.parish}
              onChange={(e) => update("parish", e.target.value)}
              disabled={!value.archdeaconry}
              className={selectCls}
            >
              <option value="">
                {value.archdeaconry
                  ? "Select parish"
                  : "Select an archdeaconry first"}
              </option>
              {parishOptions.map((church) => (
                <option key={church.id} value={church.name}>
                  {church.name}
                </option>
              ))}
            </select>
          </InputWrapper>
        </Field>

        <Field label="Occupation" htmlFor="occupation">
          <InputWrapper>
            <input
              id="occupation"
              value={value.occupation}
              onChange={(e) => update("occupation", e.target.value)}
              className={inputCls}
            />
          </InputWrapper>
        </Field>

        <Field label="Email" htmlFor="email">
          <InputWrapper>
            <input
              id="email"
              type="email"
              value={value.email}
              className={inputCls}
              onChange={(e) => update("email", e.target.value)}
            />
          </InputWrapper>
        </Field>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          className="flex-1 rounded-xl cursor-pointer bg-[#091e54] py-3.5 text-sm font-medium text-white transition hover:bg-[#0d2a72] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#091e54]/40"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
