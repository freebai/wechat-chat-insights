import { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { mockChatGroups } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface GroupSelectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedIds: string[];
    onConfirm: (ids: string[]) => void;
    title?: string;
}

export function GroupSelectDialog({
    open,
    onOpenChange,
    selectedIds,
    onConfirm,
    title = '选择群聊',
}: GroupSelectDialogProps) {
    const [search, setSearch] = useState('');
    const [localSelectedIds, setLocalSelectedIds] = useState<string[]>(selectedIds);

    // 当弹窗打开时同步外部状态
    const handleOpenChange = (open: boolean) => {
        if (open) {
            setLocalSelectedIds(selectedIds);
            setSearch('');
        }
        onOpenChange(open);
    };

    // 搜索过滤
    const filteredGroups = useMemo(() => {
        return mockChatGroups.filter(group =>
            group.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    // 切换选中状态
    const toggleGroup = (id: string) => {
        setLocalSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    // 全选/取消全选
    const toggleAll = () => {
        const allFilteredIds = filteredGroups.map(g => g.id);
        const allSelected = allFilteredIds.every(id => localSelectedIds.includes(id));

        if (allSelected) {
            setLocalSelectedIds(prev => prev.filter(id => !allFilteredIds.includes(id)));
        } else {
            setLocalSelectedIds(prev => [...new Set([...prev, ...allFilteredIds])]);
        }
    };

    // 确认选择
    const handleConfirm = () => {
        onConfirm(localSelectedIds);
        onOpenChange(false);
    };

    const allFilteredSelected = filteredGroups.length > 0 &&
        filteredGroups.every(g => localSelectedIds.includes(g.id));

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {/* 搜索框 */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="搜索群聊..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* 全选按钮 */}
                <div className="flex items-center justify-between py-2 border-b border-border">
                    <button
                        onClick={toggleAll}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Checkbox checked={allFilteredSelected} />
                        <span>全选</span>
                    </button>
                    <span className="text-xs text-muted-foreground">
                        已选 {localSelectedIds.length} 个群聊
                    </span>
                </div>

                {/* 群聊列表 */}
                <div className="max-h-64 overflow-y-auto space-y-1">
                    {filteredGroups.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground text-sm">
                            未找到匹配的群聊
                        </div>
                    ) : (
                        filteredGroups.map(group => {
                            const isSelected = localSelectedIds.includes(group.id);
                            return (
                                <button
                                    key={group.id}
                                    onClick={() => toggleGroup(group.id)}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left',
                                        isSelected
                                            ? 'bg-primary/10 text-foreground'
                                            : 'hover:bg-muted/50 text-muted-foreground'
                                    )}
                                >
                                    <Checkbox checked={isSelected} />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{group.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {group.memberCount} 人 · {group.description}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <Check className="h-4 w-4 text-primary shrink-0" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        取消
                    </Button>
                    <Button onClick={handleConfirm}>
                        确认选择 ({localSelectedIds.length})
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
