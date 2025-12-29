import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { mockChatGroups, generateMockReports, MemberStats } from '@/lib/mockData';

// 成员类型配置
const memberTypeConfig = {
    employee: { label: '企业成员', color: 'bg-blue-100 text-blue-600' },
    enterprise_friend: { label: '企业好友', color: 'bg-emerald-100 text-emerald-600' },
    external_friend: { label: '非企业好友', color: 'bg-orange-100 text-orange-600' },
};

type MemberTypeFilter = 'all' | 'employee';

export default function MemberRankingDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // 从 URL 参数获取默认值
    const initialGroupId = searchParams.get('groupId') || 'all';
    const initialMemberType = (searchParams.get('memberType') || 'all') as MemberTypeFilter;

    const [groupId, setGroupId] = useState<string>(initialGroupId);
    const [memberType, setMemberType] = useState<MemberTypeFilter>(initialMemberType);

    // 获取选中群的成员数据
    const memberData = useMemo(() => {
        let allMembers: (MemberStats & { groupId: string; groupName: string })[] = [];

        if (groupId === 'all') {
            // 获取所有群的成员数据
            mockChatGroups.forEach(group => {
                const reports = generateMockReports(group.id, 1);
                if (reports.length > 0) {
                    reports[0].memberStats.forEach(member => {
                        allMembers.push({
                            ...member,
                            groupId: group.id,
                            groupName: group.name,
                        });
                    });
                }
            });
        } else {
            // 获取指定群的成员数据
            const group = mockChatGroups.find(g => g.id === groupId);
            if (group) {
                const reports = generateMockReports(groupId, 1);
                if (reports.length > 0) {
                    reports[0].memberStats.forEach(member => {
                        allMembers.push({
                            ...member,
                            groupId: group.id,
                            groupName: group.name,
                        });
                    });
                }
            }
        }

        // 根据成员类型筛选
        if (memberType === 'employee') {
            allMembers = allMembers.filter(m => m.memberType === 'employee');
        }

        // 按消息数降序排列
        return allMembers.sort((a, b) => b.messageCount - a.messageCount);
    }, [groupId, memberType]);

    const maxCount = Math.max(...memberData.map(m => m.messageCount), 1);

    const handleReset = () => {
        setGroupId('all');
        setMemberType('all');
    };

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-50">
                        <Trophy className="h-5 w-5 text-amber-500" />
                    </div>
                    <h1 className="text-2xl font-bold">成员消息数排名</h1>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-8 bg-card p-4 rounded-lg border">
                <div className="w-[200px]">
                    <Select value={groupId} onValueChange={setGroupId}>
                        <SelectTrigger>
                            <SelectValue placeholder="选择群聊" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部群聊</SelectItem>
                            {mockChatGroups.map((group) => (
                                <SelectItem key={group.id} value={group.id}>
                                    {group.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-[200px]">
                    <Select value={memberType} onValueChange={(v) => setMemberType(v as MemberTypeFilter)}>
                        <SelectTrigger>
                            <SelectValue placeholder="成员类型" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部类型</SelectItem>
                            <SelectItem value="employee">
                                <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    企业成员
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button onClick={handleReset} variant="outline">
                    重置
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">排名</TableHead>
                            <TableHead>成员名称</TableHead>
                            {groupId === 'all' && <TableHead>所属群聊</TableHead>}
                            <TableHead className="w-[120px]">成员类型</TableHead>
                            <TableHead className="w-[300px]">消息数</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {memberData.length > 0 ? (
                            memberData.map((member, index) => (
                                <TableRow key={`${member.groupId}-${member.name}-${index}`}>
                                    <TableCell>
                                        <span className={cn(
                                            "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold",
                                            index === 0 && member.messageCount > 0 && "bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-sm",
                                            index === 1 && member.messageCount > 0 && "bg-gradient-to-br from-slate-300 to-slate-400 text-white shadow-sm",
                                            index === 2 && member.messageCount > 0 && "bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-sm",
                                            (index > 2 || member.messageCount === 0) && "bg-muted text-muted-foreground"
                                        )}>
                                            {index + 1}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-medium">{member.name}</TableCell>
                                    {groupId === 'all' && <TableCell className="text-muted-foreground">{member.groupName}</TableCell>}
                                    <TableCell>
                                        {member.memberType && (
                                            <span className={cn(
                                                "px-2 py-1 text-xs font-medium rounded",
                                                memberTypeConfig[member.memberType].color
                                            )}>
                                                {memberTypeConfig[member.memberType].label}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-500",
                                                        member.messageCount === 0
                                                            ? "bg-muted"
                                                            : "bg-gradient-to-r from-primary to-emerald-400"
                                                    )}
                                                    style={{ width: `${Math.max((member.messageCount / maxCount) * 100, 0)}%` }}
                                                />
                                            </div>
                                            <span className={cn(
                                                "text-sm font-semibold w-12 text-right",
                                                member.messageCount === 0 ? "text-muted-foreground" : "text-foreground"
                                            )}>
                                                {member.messageCount}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={groupId === 'all' ? 5 : 4} className="text-center h-24 text-muted-foreground">
                                    暂无数据
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    共 {memberData.length} 人
                    {memberType === 'employee' && ' · 仅显示企业成员'}
                </div>
            </div>
        </div>
    );
}
