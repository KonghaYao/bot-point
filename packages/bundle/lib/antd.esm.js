import * as React from "https://esm.sh/react";
globalThis.React = React;
import * as ReactDOM from "https://esm.sh/react-dom";
globalThis.ReactDom = ReactDOM;
function loadScript(url) {
    return new Promise((resolve, reject) => {
        let _script = document.createElement("script");
        _script.setAttribute("charset", "utf-8");
        _script.setAttribute("type", "text/javascript");
        _script.setAttribute("src", url);
        document.getElementsByTagName("head")[0].appendChild(_script);

        let timeout = setTimeout(() => {
            reject("timeout"); //rejected
        }, 5000);

        _script.onload = () => {
            //加载完成
            clearTimeout(timeout);
            resolve(); //fulfilled
        };
        _script.onerror = () => {
            //加载失败
            reject("fail"); //rejected
        };
    });
}
//  loadScript

await loadScript("https://unpkg.com/dayjs@1.11.13/dayjs.min.js");
await loadScript("https://unpkg.com/antd@5.24.3/dist/antd.min.js");
export const Affix = globalThis.antd.Affix;
export const Alert = globalThis.antd.Alert;
export const Anchor = globalThis.antd.Anchor;
export const App = globalThis.antd.App;
export const AutoComplete = globalThis.antd.AutoComplete;
export const Avatar = globalThis.antd.Avatar;
export const BackTop = globalThis.antd.BackTop;
export const Badge = globalThis.antd.Badge;
export const Breadcrumb = globalThis.antd.Breadcrumb;
export const Button = globalThis.antd.Button;
export const Calendar = globalThis.antd.Calendar;
export const Card = globalThis.antd.Card;
export const Carousel = globalThis.antd.Carousel;
export const Cascader = globalThis.antd.Cascader;
export const Checkbox = globalThis.antd.Checkbox;
export const Col = globalThis.antd.Col;
export const Collapse = globalThis.antd.Collapse;
export const ColorPicker = globalThis.antd.ColorPicker;
export const ConfigProvider = globalThis.antd.ConfigProvider;
export const DatePicker = globalThis.antd.DatePicker;
export const Descriptions = globalThis.antd.Descriptions;
export const Divider = globalThis.antd.Divider;
export const Drawer = globalThis.antd.Drawer;
export const Dropdown = globalThis.antd.Dropdown;
export const Empty = globalThis.antd.Empty;
export const Flex = globalThis.antd.Flex;
export const FloatButton = globalThis.antd.FloatButton;
export const Form = globalThis.antd.Form;
export const Grid = globalThis.antd.Grid;
export const Image = globalThis.antd.Image;
export const Input = globalThis.antd.Input;
export const InputNumber = globalThis.antd.InputNumber;
export const Layout = globalThis.antd.Layout;
export const List = globalThis.antd.List;
export const Mentions = globalThis.antd.Mentions;
export const Menu = globalThis.antd.Menu;
export const Modal = globalThis.antd.Modal;
export const Pagination = globalThis.antd.Pagination;
export const Popconfirm = globalThis.antd.Popconfirm;
export const Popover = globalThis.antd.Popover;
export const Progress = globalThis.antd.Progress;
export const QRCode = globalThis.antd.QRCode;
export const Radio = globalThis.antd.Radio;
export const Rate = globalThis.antd.Rate;
export const Result = globalThis.antd.Result;
export const Row = globalThis.antd.Row;
export const Segmented = globalThis.antd.Segmented;
export const Select = globalThis.antd.Select;
export const Skeleton = globalThis.antd.Skeleton;
export const Slider = globalThis.antd.Slider;
export const Space = globalThis.antd.Space;
export const Spin = globalThis.antd.Spin;
export const Splitter = globalThis.antd.Splitter;
export const Statistic = globalThis.antd.Statistic;
export const Steps = globalThis.antd.Steps;
export const Switch = globalThis.antd.Switch;
export const Table = globalThis.antd.Table;
export const Tabs = globalThis.antd.Tabs;
export const Tag = globalThis.antd.Tag;
export const TimePicker = globalThis.antd.TimePicker;
export const Timeline = globalThis.antd.Timeline;
export const Tooltip = globalThis.antd.Tooltip;
export const Tour = globalThis.antd.Tour;
export const Transfer = globalThis.antd.Transfer;
export const Tree = globalThis.antd.Tree;
export const TreeSelect = globalThis.antd.TreeSelect;
export const Typography = globalThis.antd.Typography;
export const Upload = globalThis.antd.Upload;
export const Watermark = globalThis.antd.Watermark;
export const message = globalThis.antd.message;
export const notification = globalThis.antd.notification;
export const theme = globalThis.antd.theme;
export const unstableSetRender = globalThis.antd.unstableSetRender;
export const version = globalThis.antd.version;
