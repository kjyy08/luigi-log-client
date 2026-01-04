import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetMyProfile, useUpdateMyProfile } from "@/entities/profile/model/profile.queries";
import { useUploadFile } from "@/entities/file/model/file.mutations";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { useToast } from "@/shared/hooks/use-toast";
import { Camera, Loader2, Save } from "lucide-react";

// 프로필 수정 스키마 정의
const profileSchema = z.object({
    nickname: z.string().min(2, "닉네임은 2글자 이상이어야 합니다."),
    bio: z.string().optional(),
    jobTitle: z.string().optional(),
    techStack: z.string().optional(), // 쉼표로 구분된 문자열로 입력받고 배열로 변환 예정
    githubUrl: z.string().url("올바른 URL 형식이 아닙니다.").optional().or(z.literal("")),
    websiteUrl: z.string().url("올바른 URL 형식이 아닙니다.").optional().or(z.literal("")),
    contactEmail: z.string().email("이메일 형식이 아닙니다.").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const SettingsPage = () => {
    const { data: profile, isLoading: isProfileLoading } = useGetMyProfile();
    const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateMyProfile();
    const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            nickname: "",
            bio: "",
            jobTitle: "",
            techStack: "",
            githubUrl: "",
            websiteUrl: "",
            contactEmail: "",
        },
    });

    // 프로필 데이터 로드 시 폼 초기화
    useEffect(() => {
        if (profile) {
            form.reset({
                nickname: profile.nickname || "",
                bio: profile.bio || "",
                jobTitle: profile.jobTitle || "",
                techStack: profile.techStack?.join(", ") || "",
                githubUrl: profile.githubUrl || "",
                websiteUrl: profile.websiteUrl || "",
                contactEmail: profile.contactEmail || "",
            });
        }
    }, [profile, form]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // file.api.ts의 uploadFile 함수가 내부적으로 FormData를 생성하므로 File 객체를 그대로 전달해야 함
            const response = await uploadFile(file);

            // 이미지 업로드 성공 시 즉시 프로필 업데이트
            if (response?.publicUrl && profile) {
                await updateProfile({
                    ...profile,
                    profileImageUrl: response.publicUrl,
                    techStack: profile.techStack || []
                });
                toast({ title: "프로필 이미지 업데이트 성공", description: "새로운 프로필 이미지가 저장되었습니다." });
            }
        } catch (error) {
            toast({ title: "업로드 실패", description: "이미지 업로드 중 오류가 발생했습니다.", variant: "destructive" });
        }
    };

    const handleTriggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = async (values: ProfileFormValues) => {
        if (!profile) return;

        try {
            await updateProfile({
                nickname: values.nickname,
                bio: values.bio || "",
                jobTitle: values.jobTitle || "",
                githubUrl: values.githubUrl || "",
                websiteUrl: values.websiteUrl || "",
                contactEmail: values.contactEmail || "",
                profileImageUrl: profile.profileImageUrl || "",
                techStack: values.techStack ? values.techStack.split(",").map(t => t.trim()).filter(Boolean) : [],
            });
            toast({ title: "저장 완료", description: "프로필 정보가 수정되었습니다." });
        } catch (error) {
            toast({ title: "저장 실패", description: "프로필 수정 중 오류가 발생했습니다.", variant: "destructive" });
        }
    };

    if (isProfileLoading) {
        return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
    }

    return (
        <div className="container max-w-2xl py-10 animate-fade-in">
            <h1 className="text-3xl font-bold mb-8">설정</h1>

            <div className="bg-card border rounded-xl p-6 shadow-sm space-y-8">
                {/* 프로필 이미지 섹션 */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative group cursor-pointer" onClick={handleTriggerFileUpload}>
                        <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                            <AvatarImage src={profile?.profileImageUrl} className="object-cover" />
                            <AvatarFallback className="text-4xl bg-muted">{profile?.nickname?.[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            {isUploading ? <Loader2 className="h-8 w-8 text-white animate-spin" /> : <Camera className="h-8 w-8 text-white" />}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">{profile?.nickname}</h2>
                        <p className="text-sm text-muted-foreground">{profile?.contactEmail || "No Email"}</p>
                    </div>
                </div>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="nickname">닉네임</Label>
                            <Input id="nickname" {...form.register("nickname")} placeholder="닉네임을 입력하세요" />
                            {form.formState.errors.nickname && <p className="text-xs text-destructive">{form.formState.errors.nickname.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jobTitle">직업 / 타이틀</Label>
                            <Input id="jobTitle" {...form.register("jobTitle")} placeholder="예: Frontend Developer" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">자기소개</Label>
                        <Textarea id="bio" {...form.register("bio")} placeholder="간단한 자기소개를 입력하세요" className="h-24 resize-none" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="techStack">기술 스택 (쉼표로 구분)</Label>
                        <Input id="techStack" {...form.register("techStack")} placeholder="React, TypeScript, Next.js" />
                        <p className="text-xs text-muted-foreground">여러 개의 기술은 쉼표(,)로 구분하여 입력해주세요.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="githubUrl">GitHub URL</Label>
                            <Input id="githubUrl" {...form.register("githubUrl")} placeholder="https://github.com/username" />
                            {form.formState.errors.githubUrl && <p className="text-xs text-destructive">{form.formState.errors.githubUrl.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="websiteUrl">웹사이트 URL</Label>
                            <Input id="websiteUrl" {...form.register("websiteUrl")} placeholder="https://mywebsite.com" />
                            {form.formState.errors.websiteUrl && <p className="text-xs text-destructive">{form.formState.errors.websiteUrl.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactEmail">연락처 이메일</Label>
                        <Input id="contactEmail" {...form.register("contactEmail")} placeholder="contact@example.com" />
                        {form.formState.errors.contactEmail && <p className="text-xs text-destructive">{form.formState.errors.contactEmail.message}</p>}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={isUpdating} className="min-w-[120px]">
                            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            저장하기
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
