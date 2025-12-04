import { useState } from 'react';
import { Save, Plus, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { scoreDimensions } from '@/lib/mockData';
import { InfoTooltip } from '@/components/common/InfoTooltip';

interface KeywordRule {
  id: string;
  keyword: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export default function RulesSettings() {
  const { toast } = useToast();
  
  const [weights, setWeights] = useState({
    responseActivity: 30,
    memberInteraction: 25,
    sentimentHealth: 25,
    topicCoverage: 20,
  });

  const [thresholds, setThresholds] = useState({
    targetMessages: 100,
    workingHoursStart: 9,
    workingHoursEnd: 18,
    warningScore: 30,
    criticalScore: 20,
  });

  const [emailNotifications, setEmailNotifications] = useState({
    dailyReport: true,
    criticalWarning: true,
    anomalyDetection: true,
  });

  const [keywords, setKeywords] = useState<KeywordRule[]>([
    { id: '1', keyword: '投诉', sentiment: 'negative' },
    { id: '2', keyword: '感谢', sentiment: 'positive' },
    { id: '3', keyword: '延期', sentiment: 'negative' },
  ]);

  const handleSave = () => {
    toast({
      title: '配置已保存',
      description: '分析规则配置已更新，将在下次分析时生效',
    });
  };

  const addKeyword = () => {
    setKeywords([
      ...keywords,
      { id: Date.now().toString(), keyword: '', sentiment: 'neutral' },
    ]);
  };

  const removeKeyword = (id: string) => {
    setKeywords(keywords.filter(k => k.id !== id));
  };

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">规则配置</h1>
          <p className="text-muted-foreground mt-1">自定义群聊分析规则和评分权重</p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          保存配置
        </Button>
      </div>

      <div className="space-y-8">
        {/* Scoring Weights */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            评分权重配置
            <InfoTooltip content="调整各维度在总分中的权重占比，所有权重之和应为100%" />
          </h2>
          <div className="space-y-6">
            {Object.entries(scoreDimensions).map(([key, dim]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    {dim.name}
                    <InfoTooltip content={dim.description} />
                  </Label>
                  <span className="text-sm font-medium">{weights[key as keyof typeof weights]}%</span>
                </div>
                <Slider
                  value={[weights[key as keyof typeof weights]]}
                  onValueChange={([value]) => setWeights({ ...weights, [key]: value })}
                  max={50}
                  step={5}
                />
              </div>
            ))}
            <p className="text-sm text-muted-foreground">
              当前权重总和: {Object.values(weights).reduce((a, b) => a + b, 0)}%
              {Object.values(weights).reduce((a, b) => a + b, 0) !== 100 && (
                <span className="text-destructive ml-2">（需要调整为100%）</span>
              )}
            </p>
          </div>
        </div>

        {/* Analysis Thresholds */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            分析阈值设置
            <InfoTooltip content="设置评分计算和预警触发的基准值" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                目标日均消息数
                <InfoTooltip content="响应活跃度满分的日均消息数标准" />
              </Label>
              <Input
                type="number"
                value={thresholds.targetMessages}
                onChange={(e) => setThresholds({ ...thresholds, targetMessages: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                预警分数阈值
                <InfoTooltip content="低于此分数将触发邮件预警通知" />
              </Label>
              <Input
                type="number"
                value={thresholds.warningScore}
                onChange={(e) => setThresholds({ ...thresholds, warningScore: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>工作时段开始</Label>
              <Input
                type="number"
                value={thresholds.workingHoursStart}
                onChange={(e) => setThresholds({ ...thresholds, workingHoursStart: Number(e.target.value) })}
                min={0}
                max={23}
              />
            </div>
            <div className="space-y-2">
              <Label>工作时段结束</Label>
              <Input
                type="number"
                value={thresholds.workingHoursEnd}
                onChange={(e) => setThresholds({ ...thresholds, workingHoursEnd: Number(e.target.value) })}
                min={0}
                max={23}
              />
            </div>
          </div>
        </div>

        {/* Keyword Rules */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              关键词监控
              <InfoTooltip content="配置情感分析的关键词规则" />
            </h2>
            <Button variant="outline" size="sm" onClick={addKeyword} className="gap-2">
              <Plus className="h-4 w-4" />
              添加关键词
            </Button>
          </div>
          <div className="space-y-3">
            {keywords.map((rule) => (
              <div key={rule.id} className="flex items-center gap-4">
                <Input
                  placeholder="输入关键词"
                  value={rule.keyword}
                  onChange={(e) => setKeywords(keywords.map(k =>
                    k.id === rule.id ? { ...k, keyword: e.target.value } : k
                  ))}
                  className="flex-1"
                />
                <select
                  value={rule.sentiment}
                  onChange={(e) => setKeywords(keywords.map(k =>
                    k.id === rule.id ? { ...k, sentiment: e.target.value as any } : k
                  ))}
                  className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="positive">正面</option>
                  <option value="neutral">中性</option>
                  <option value="negative">负面</option>
                </select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeKeyword(rule.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Email Notifications */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            邮件通知设置
            <InfoTooltip content="配置自动邮件通知的触发条件" />
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>每日分析报告</Label>
                <p className="text-sm text-muted-foreground">每日自动发送分析报告摘要</p>
              </div>
              <Switch
                checked={emailNotifications.dailyReport}
                onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, dailyReport: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>预警通知</Label>
                <p className="text-sm text-muted-foreground">健康分低于阈值时发送预警邮件</p>
              </div>
              <Switch
                checked={emailNotifications.criticalWarning}
                onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, criticalWarning: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>异常检测</Label>
                <p className="text-sm text-muted-foreground">健康分单日下降超过20分时通知</p>
              </div>
              <Switch
                checked={emailNotifications.anomalyDetection}
                onCheckedChange={(checked) => setEmailNotifications({ ...emailNotifications, anomalyDetection: checked })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
