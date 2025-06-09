// 同步加载组件
import('./clock/main.js').then(() => {
    import('./quick-access/main.js');
});

// 确保组件已定义
customElements.whenDefined('my-clock').then(() => {
    customElements.whenDefined('quick-access').then(() => {
        console.log('All components loaded');
    });
});

// 设置主题
document.documentElement.style.setProperty('--bg-color', '#f5f5f5');
document.documentElement.style.setProperty('--text-color', '#333333');
document.documentElement.style.setProperty('--card-bg', '#ffffff');
document.documentElement.style.setProperty('--card-shadow', '8px 8px 16px #d9d9d9, -8px -8px 16px #ffffff');
document.documentElement.style.setProperty('--icon-bg', '#f0f0f0');
document.documentElement.style.setProperty('--add-card-bg', '#f0f0f0');
document.documentElement.style.setProperty('--add-card-color', '#333333');
document.body.style.backgroundColor = '#f5f5f5';
