import { useState } from 'react';
import { Save, Settings2, Sliders, Users, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { scoreDimensions, defaultThresholds, ScoreThresholds, defaultGroupScoringConfig, GroupScoringConfig, mockChatGroups } from '@/lib/mockData';
import { InfoTooltip } from '@/components/common/InfoTooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GroupSelectDialog } from '@/components/GroupSelectDialog';

export default function RulesSettings() {
  const { toast } = useToast();

  // 阈值配置状态
  const [thresholds, setThresholds] = useState<ScoreThresholds>(defaultThresholds);

  // 权重配置 - 基于六维模型
  const [weights, setWeights] = useState({
    // 统计类 (60%)
    speakerPenetration: 21,      // 35% * 60%
    avgMessagesPerSpeaker: 15,   // 25% * 60%
    responseSpeedScore: 12,      // 20% * 60%
    timeDistributionScore: 12,   // 20% * 60%
    // 语义类 (40%)
    topicRelevanceScore: 28,     // 70% * 40%
    atmosphereScore: 12,         // 30% * 40%
  });

  // 群评分参与配置
  const [scoringConfig, setScoringConfig] = useState<GroupScoringConfig>(defaultGroupScoringConfig);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 获取已选群聊的名称列表
  const selectedGroupNames = scoringConfig.groupIds
    .map(id => mockChatGroups.find(g => g.id === id)?.name)
    .filter(Boolean);

  const handleSave = () => {
    toast({
      title: '配置已保存',
      description: '分析规则配置已更新，将在下次分析时生效',
    });
  };

  const statisticalTotal = weights.speakerPenetration + weights.avgMessagesPerSpeaker +
    weights.responseSpeedScore + weights.timeDistributionScore;
  const semanticTotal = weights.topicRelevanceScore + weights.atmosphereScore;
  const totalWeight = statisticalTotal + semanticTotal;

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">规则配置</h1>
          <p className="text-muted-foreground mt-1">自定义群聊分析规则、评分权重和阈值参数</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          保存配置
        </Button>
      </div>

      <div className="space-y-8">
        {/* Threshold Settings */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            评分阈值设置
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            这些参数决定了评分的计算标准和异常判定规则
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                活跃发言量满分线
                <InfoTooltip content="每个发言者平均发送多少条消息才能获得满分。例如设为20，表示人均发言20条即可获得该项满分。" />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={thresholds.avgMessagesPerSpeakerTarget}
                  onChange={(e) => setThresholds({ ...thresholds, avgMessagesPerSpeakerTarget: Number(e.target.value) })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">条/人</span>
              </div>
              <p className="text-xs text-muted-foreground">当前：人均发言达到 {thresholds.avgMessagesPerSpeakerTarget} 条即满分</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                消息响应时间上限
                <InfoTooltip content="群友之间的消息回复间隔超过此时间后，消息间隔分降为0。间隔越短，得分越高。" />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={thresholds.responseSpeedBase}
                  onChange={(e) => setThresholds({ ...thresholds, responseSpeedBase: Number(e.target.value) })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">秒</span>
              </div>
              <p className="text-xs text-muted-foreground">当前：回复间隔 ≤ {(thresholds.responseSpeedBase / 60).toFixed(0)} 分钟内可得分</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                冲突预警评分线
                <InfoTooltip content="当群内氛围评分低于此值时，系统判定存在冲突风险，总分会被降权处理并向运营人员发出预警。" />
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={thresholds.atmosphereMeltdownThreshold}
                  onChange={(e) => setThresholds({ ...thresholds, atmosphereMeltdownThreshold: Number(e.target.value) })}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">分</span>
              </div>
              <p className="text-xs text-muted-foreground">当前：氛围分 &lt; {thresholds.atmosphereMeltdownThreshold} 触发预警并降权</p>
            </div>
          </div>
        </div>

        {/* Scoring Weights */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sliders className="h-5 w-5" />
            评分权重配置
            <InfoTooltip content="调整各维度在总分中的权重占比，所有权重之和应为100%" />
          </h2>

          {/* 统计类指标 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span className="text-sm font-medium">统计类指标</span>
              <span className="text-xs text-muted-foreground">(推荐60%)</span>
              <span className={`ml-auto text-sm font-medium ${statisticalTotal === 60 ? 'text-primary' : 'text-yellow-500'}`}>
                当前: {statisticalTotal}%
              </span>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-blue-500/30">
              {Object.entries(scoreDimensions)
                .filter(([, dim]) => dim.category === 'statistical')
                .map(([key, dim]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        {dim.name}
                        <InfoTooltip content={`${dim.description} | 计算公式: ${dim.formula}`} />
                      </Label>
                      <span className="text-sm font-medium">{weights[key as keyof typeof weights]}%</span>
                    </div>
                    <Slider
                      value={[weights[key as keyof typeof weights]]}
                      onValueChange={([value]) => setWeights({ ...weights, [key]: value })}
                      max={40}
                      step={1}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* 语义类指标 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="text-sm font-medium">语义类指标</span>
              <span className="text-xs text-muted-foreground">(推荐40%)</span>
              <span className={`ml-auto text-sm font-medium ${semanticTotal === 40 ? 'text-primary' : 'text-yellow-500'}`}>
                当前: {semanticTotal}%
              </span>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-purple-500/30">
              {Object.entries(scoreDimensions)
                .filter(([, dim]) => dim.category === 'semantic')
                .map(([key, dim]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        {dim.name}
                        <InfoTooltip content={`${dim.description} | 计算公式: ${dim.formula}`} />
                      </Label>
                      <span className="text-sm font-medium">{weights[key as keyof typeof weights]}%</span>
                    </div>
                    <Slider
                      value={[weights[key as keyof typeof weights]]}
                      onValueChange={([value]) => setWeights({ ...weights, [key]: value })}
                      max={40}
                      step={1}
                    />
                  </div>
                ))}
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            当前权重总和: {totalWeight}%
            {totalWeight !== 100 && (
              <span className="text-destructive ml-2">（需要调整为100%）</span>
            )}
          </p>
        </div>

        {/* Group Scoring Config */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" />
            群评分参与配置
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            配置哪些群聊参与健康度评分计算
          </p>

          <RadioGroup
            value={scoringConfig.mode === 'all' ? 'all' : 'custom'}
            onValueChange={(value) => {
              if (value === 'all') {
                setScoringConfig({ mode: 'all', groupIds: [] });
              } else {
                setScoringConfig(prev => ({ ...prev, mode: 'include' }));
              }
            }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="all" id="scoring-all" />
              <Label htmlFor="scoring-all" className="cursor-pointer">
                全部群聊参与评分
              </Label>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="custom" id="scoring-custom" />
                <Label htmlFor="scoring-custom" className="cursor-pointer">
                  自定义
                </Label>
              </div>

              {scoringConfig.mode !== 'all' && (
                <div className="ml-7 space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                  {/* 自定义模式子选项 */}
                  <RadioGroup
                    value={scoringConfig.mode}
                    onValueChange={(value: 'include' | 'exclude') => {
                      setScoringConfig(prev => ({ ...prev, mode: value }));
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="include" id="mode-include" />
                      <Label htmlFor="mode-include" className="cursor-pointer text-sm">
                        仅以下群参与评分
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="exclude" id="mode-exclude" />
                      <Label htmlFor="mode-exclude" className="cursor-pointer text-sm">
                        以下群不参与评分
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* 选择群聊按钮 */}
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDialogOpen(true)}
                      className="gap-2"
                    >
                      <Users className="h-4 w-4" />
                      选择群聊
                      {scoringConfig.groupIds.length > 0 && (
                        <span className="px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
                          {scoringConfig.groupIds.length}
                        </span>
                      )}
                    </Button>
                  </div>

                  {/* 已选群聊展示 */}
                  {selectedGroupNames.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedGroupNames.map((name, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-muted rounded border border-border"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </RadioGroup>

          {/* 评分参与门槛 */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              评分参与门槛
              <InfoTooltip content="群聊需满足以下条件才会参与评分，否则仅显示基础指标" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  最少消息数要求
                  <InfoTooltip content="群内消息数少于此值时，认为数据不足，暂不生成评分，避免评分失真。" />
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={thresholds.coldStartMessageThreshold}
                    onChange={(e) => setThresholds({ ...thresholds, coldStartMessageThreshold: Number(e.target.value) })}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">条</span>
                </div>
                <p className="text-xs text-muted-foreground">当前：消息 &lt; {thresholds.coldStartMessageThreshold} 条的群暂不评分</p>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  最少成员数要求
                  <InfoTooltip content="成员数少于此值的群为微型群，评分仅供参考，不参与群健康排名。" />
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={thresholds.microGroupMemberThreshold}
                    onChange={(e) => setThresholds({ ...thresholds, microGroupMemberThreshold: Number(e.target.value) })}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">人</span>
                </div>
                <p className="text-xs text-muted-foreground">当前：成员 &lt; {thresholds.microGroupMemberThreshold} 人的群不参与排名</p>
              </div>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="mt-6 flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              不参与评分的群聊仍会正常统计基础指标，仅不计入健康度评分排名。
            </p>
          </div>
        </div>
      </div>

      {/* 群选择弹窗 */}
      <GroupSelectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedIds={scoringConfig.groupIds}
        onConfirm={(ids) => setScoringConfig(prev => ({ ...prev, groupIds: ids }))}
        title={scoringConfig.mode === 'include' ? '选择参与评分的群聊' : '选择不参与评分的群聊'}
      />
    </div>
  );
}
