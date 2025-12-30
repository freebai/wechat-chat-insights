import React from 'react';
import ipConfigImg from '@/assets/tutorial/ip-config.png';
import keyGenerationImg from '@/assets/tutorial/key-generation.png';
import copyPrivateKeyImg from '@/assets/tutorial/copy-private-key.png';
import savePubKeyImg from '@/assets/tutorial/save-pub-key.png';
import adminPanelImg from '@/assets/tutorial/admin-panel.png';
import versionNumberImg from '@/assets/tutorial/version-number.png';

export function ArchiveConfigTutorial() {
    return (
        <div className="space-y-8 text-sm text-foreground">
            {/* 企微后台 */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">1</span>
                    企微后台配置
                </h3>

                <div className="ml-8 space-y-6">
                    <div className="space-y-2">
                        <h4 className="font-medium text-base">1. 输入可信IP地址</h4>
                        <p className="text-muted-foreground">
                            请依次添加以下三个IP地址（缺一不可）：
                            <br />
                            <code className="bg-muted px-1 py-0.5 rounded">36.139.125.93</code>
                            <span className="mx-2">,</span>
                            <code className="bg-muted px-1 py-0.5 rounded">36.137.31.221</code>
                            <span className="mx-2">,</span>
                            <code className="bg-muted px-1 py-0.5 rounded">36.139.168.38</code>
                        </p>
                        <div className="mt-2 border rounded-lg overflow-hidden">
                            <img
                                src={ipConfigImg}
                                alt="配置可信IP"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-medium text-base">2. 生成消息加密公私钥</h4>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                1）访问 <a href="http://web.chacuo.net/netrsakeypair" target="_blank" rel="noreferrer" className="text-primary hover:underline">密钥对生成工具</a>
                            </p>
                            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                                <p>生成 RSA 2048位 PKCS#8 密钥对（不需要密码）</p>
                                <div className="flex items-start gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                                    <span>⚠️</span>
                                    <p>密钥文件请妥善保管，重置会导致之前记录丢失</p>
                                </div>
                            </div>
                            <ul className="list-decimal list-inside space-y-1 ml-1">
                                <li>将加密公钥的文本输出到文件 <code className="text-foreground">pub.key</code></li>
                                <li>将加密私钥的文本输出到文件 <code className="text-foreground">pri.key</code></li>
                                <li>将 <code className="text-foreground">pub.key</code> 文件内容复制保存到企业微信后台，并记录消息加密公钥版本号。</li>
                                <li>配置完成后，点击“立即开启”。</li>
                            </ul>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="border rounded-lg overflow-hidden">
                                <img
                                    src={keyGenerationImg}
                                    alt="生成密钥对"
                                    className="w-full h-auto"
                                />
                            </div>
                            <div className="border rounded-lg overflow-hidden">
                                <img
                                    src={copyPrivateKeyImg}
                                    alt="复制私钥"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>

                        <p className="pt-2 text-muted-foreground">2）把 pub.key 文件的内容复制到企业微信后台【消息加密公钥】并保存</p>
                        <div className="mt-2 border rounded-lg overflow-hidden">
                            <img
                                src={savePubKeyImg}
                                alt="配置公钥"
                                className="w-full h-auto"
                            />
                        </div>

                        <p className="pt-2 text-muted-foreground">3）下拉点击立即开启（开启后，存档员工登陆企业微信以及和客户沟通时，会发送服务须知）</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-border/50 my-6" />

            {/* 库米云店长后台 */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">2</span>
                    库米云店长后台配置
                </h3>

                <div className="ml-8 space-y-6">
                    <p className="text-muted-foreground">
                        把企业微信的企业ID、会话存档的 Secret 密钥、pri.key 私钥文件的内容、版本号保存在管理后台
                    </p>

                    <div className="mt-2 border rounded-lg overflow-hidden">
                        <img
                            src={adminPanelImg}
                            alt="后台配置界面"
                            className="w-full h-auto"
                        />
                    </div>

                    <div className="grid gap-4 bg-muted/30 p-4 rounded-lg">
                        <div className="space-y-1">
                            <span className="font-medium text-foreground">企业ID：</span>
                            <span className="text-muted-foreground">企业微信PC端 &gt; 我的企业 &gt; 企业信息 &gt; 企业ID</span>
                        </div>

                        <div className="space-y-1">
                            <span className="font-medium text-foreground">会话密钥：</span>
                            <span className="text-muted-foreground">企业微信PC端 &gt; 管理工具 &gt; 会话存档 &gt; 会话Secret</span>
                        </div>

                        <div className="space-y-1">
                            <span className="font-medium text-foreground">私钥：</span>
                            <p className="text-muted-foreground">
                                使用第一步生成的 <code className="text-foreground">pri.key</code> 私钥内容。
                                <br />
                                <span className="text-orange-600 text-xs">注意点：在复制私钥时，只需要复制中间内容，不需要前后缀。</span>
                            </p>
                            <div className="mt-2 border rounded-lg overflow-hidden w-2/3">
                                <img
                                    src={copyPrivateKeyImg}
                                    alt="私钥复制示例"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="font-medium text-foreground">版本号：</span>
                            <p className="text-muted-foreground">
                                企业微信电脑端 &gt; 会话存档 &gt; 公钥配置完成后，生成的版本号（填写数字即可）
                            </p>
                            <div className="mt-2 border rounded-lg overflow-hidden">
                                <img
                                    src={versionNumberImg}
                                    alt="版本号位置"
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
