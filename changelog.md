
ℹ️ You can check the Charting Library version by executing `TradingView.version()` in a browser console.

<!-- markdownlint-disable no-emphasis-as-header -->
<!-- markdownlint-disable no-inline-html -->
<!-- markdownlint-disable code-block-style -->

## Version 24.003

*Date: Tue Apr 11 2023*

**New Features**

- **Images within bar marks.** Bar marks now support the rendering of images as the background by specifying the `imageUrl` property. Please see the [Mark](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.Mark) interface for more details.
- **Price Source and Long Description symbol info fields.** Add support for displaying the price source and long description fields from the symbol info.
  - To enable the price source first add `symbol_info_price_source` to the list of enabled features. Then it will be shown in the legend, if available. It can be hidden through the legend context menu and the series property dialog.
  - To enable the long description first add `symbol_info_long_description` to the list of enabled features. Then it will be shown in the legend, if available. It can be hidden through the legend context menu and the series property dialog.

**Improvements**

- **Added more styling options for bar marks.** The styling options for bar marks has been expanded to include options for styling the border.
  - Border color can be set using the `border` property within `color` of the Mark interface. See [MarkCustomColor](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.MarkCustomColor)
  - Border width can be set using `borderWidth` and `hoveredBorderWidth`. See [Mark](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.Mark)
- **Drawing tools favorites can now be defined within widget constructor.** Drawing tools can now be defined as favorites using the [`favorites`](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.ChartingLibraryWidgetOptions#favorites) property of the widget constructor options. See [Favorites.drawingTools](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.Favorites#drawingtools) for more information.
- **Context menu API can now be used within the Watchlist.** `watchlist_context_menu` featureset is enabled by default. See [onContextMenu](https://www.tradingview.com/charting-library-docs/latest/api/interfaces/Charting_Library.IChartingLibraryWidget#oncontextmenu) for more details.
- **Improved typings within package.json.** The `package.json` bundled with the library has been improved to support newer versions of node, and offer improved typings. See [NPM](https://www.tradingview.com/charting-library-docs/latest/getting_started/NPM) for more details.
- **Price scale now supports numbers with more than 10 decimal points.**
- **Timezone data has been updated.**

**Bug Fixes**

- **Chart type won't change when restoring default options.** The chart type will no longer change when restoring the default options within the chart settings dialog.
- **Last visible bar value in legend for overlay studies.** When `use_last_visible_bar_value_in_legend` featureset is enabled, overlay studies will display the value for the last visible item on the chart. This now matches the behavior for the main series.
- **Fixed zoom behavior for percentage right margin option.** Incorrect zooming behavior has been fixed for zoom buttons appearing on the chart, and the keyboard shortcuts. See `show_percent_option_for_right_margin` [featureset](https://www.tradingview.com/charting-library-docs/latest/customization/Featuresets) for more information.

**Documentation**

- **Add FAQ about unsubscribeBars delay.** Added [a new FAQ](https://www.tradingview.com/charting-library-docs/latest/getting_started/Frequently-Asked-Questions) about [`unsubscribeBars`](https://www.tradingview.com/charting-library-docs/latest/connecting_data/Datafeed-API#unsubscribebars) being called with a delay.

**Other**

- **Added symbol information to datafeed error messages.** Added symbol information to realtime subscription error messages to improve the developer experience.
- **Updated localisation list.** The [list of support localisations](https://www.tradingview.com/charting-library-docs/latest/core_concepts/Localization) has been updated. Additionally, the chart will now fallback to english (with a console warning) if an unsupported locale is specified in the widget constructor options.

## Version 24.002

**New Features**

- **Added support for specifying custom timezones.**
  - Additional custom timezones can now be specified for use within the library. Please see the [Adding Custom Timezones](../ui_elements/timezones#adding-custom-timezones) section within the Timezones page.
- **Images within timescale marks.**
  - Timescale marks now support the rendering of images within the circular shape by specifying the `imageUrl` property. Please see the [TimescaleMark](../api/interfaces/Charting_Library.TimescaleMark) interface for more details.
- **Support different margin rates for different order types.** [6607](https://github.com/tradingview/charting_library/issues/6607)
  - `marginRate` has been deprecated
  - A [`supportLeverageButton`](../api/interfaces/Broker.BrokerConfigFlags#supportleveragebutton) flag that displays a leverage button has been added to the Broker configuration.
  - The [`supportLeverage`](../api/interfaces/Broker.BrokerConfigFlags#supportleverage) flag enables leverage calculation by getting information from `leverageInfo`.

**Enhancements**

- Add horizontal line at 0 for Momentum study.

**Bug fixes**

- [`setUserEditEnabled`](../api/interfaces/Charting_Library.IStudyApi#setusereditenabled) does not hide 3 dots in Legend. [6765](https://github.com/tradingview/charting_library/issues/6765) | [6165](https://github.com/tradingview/charting_library/issues/6165)

      widget.activeChart().getAllStudies().forEach(({ id }) => {
        console.log(id);
        tvWidget.activeChart().getStudyById(id).setUserEditEnabled(false);
      });

  - setUserEditEnabled(false) should mask all icons except the "eye".
  - setUserEditEnabled(true) should restore all the icons.
- `priceFormatter` could previously only be used for main series. `priceFormatter` now applies to secondary series as well.
- `right_toolbar` featureset didn't have a default `on` value.
- Empty time frames at the bottom toolbar if `data_status: endofday`
- Export data doesn’t include projected data.
  - Projected data can be included by setting [`includeOffsetStudyValues`](../api/interfaces/Charting_Library.ExportDataOptions#includeoffsetstudyvalues) to `true`.
  - `await widget.activeChart().exportData({ includeOffsetStudyValues: true });`
- Highest PineJS.Std function doesn’t work correctly with negative numbers.
- Missing types in bundled definition file. [7445](https://github.com/tradingview/charting_library/issues/7445) | [7446](https://github.com/tradingview/charting_library/issues/7446)
- Exposing `icon` prop in `CreateShapeOptionsBase`. [6723](https://github.com/tradingview/charting_library/issues/6723)
- Wrong extended session background color [7443](https://github.com/tradingview/charting_library/issues/7443)

**Documentation**

- Added [migration guide](../trading_terminal/#how-to-migrate-from-charting-library) from TAC to CTP.
- Added additional documentation for [Drawings](../ui_elements/drawings/).
- Missing overrides in documentation. [7457](https://github.com/tradingview/charting_library/issues/7457)
- Updated documentation for [Marks](../ui_elements/Marks).
- Align ChartMetaInfo & ChartData.

**Other**

- Removed `Australia/ACT` from the list of [timezones](../ui_elements/timezones) within our documentation. Please use either the Sydney timezone or [specify your own custom timezone](../ui_elements/timezones#adding-custom-timezones).

## Version 24.001

**New Features**

- **Adding originalText as an additional field to UndoRedoState.** Event should mention the name of the action in plain English in addition to also being translated to the corresponding language. [UndoRedoState](@api/interfaces/Charting_Library.UndoRedoState#originalundotext)
- **Add the ability to change X-Axis margin % from Chart Properties.** A new [featureset](@docs/customization/Featuresets) has been added `show_percent_option_for_right_margin` that adds additional percentage option to the right margin section of the chart settings dialog.
- **Display rightmost visible value when in percent mode.** A new [featureset](@docs/customization/Featuresets) has been added `use_last_visible_bar_value_in_legend` to show the most recent “global” bar value. When this feature is enabled the rightmost bar in the visible range is used instead.
- **Ability to change on the fly the Currency and Unit label setting.** [currencyAndUnitVisibility API](@api/interfaces/Charting_Library.IChartingLibraryWidget#currencyandunitvisibility)
- **Add simple SSR support.** Allow the library to be imported within a NodeJS context. This improves support for frameworks such as Remix.
- **Added [`clearUndoHistory`](@api/interfaces/Charting_Library.IChartingLibraryWidget#clearundohistory).**

**Improvements**

- **Name to be used instead of ticker.** Allow a human friendly name to be returned from [`symbol_search_complete`](@api/interfaces/Charting_Library.ChartingLibraryWidgetOptions#symbol_search_complete).

**Bug Fixes**

- **Incomplete indicators when using Heikin-Ashi.** Indicator line should draw to all the visible data points.
- **Compare study doesn’t save and restore ticker name correctly.** The compare study should work for custom ticker names just like it does for ticker names which match our format (with the colon).
- **VPFR: Right point is automatically moving when dragging start point.** When drawing the VPFR, or moving one of the anchor points, it is expected that the right anchor point should not move one bar further to the right.
- **Selecting Apply Defaults option within chart settings doesn’t work.** Some Settings even if not validated are not restored to their original values when Apply Defaults is selected.
- **Decentralised app browser loading error.** Chart fails to load in wallet apps like MetaMask, Trust & Phantom. Enable the `iframe_loading_compatibility_mode` [featureset](@docs/customization/Featuresets) to enable compatibility with these browsers.
- **When disabled, widget bar still present a significant margin.** Even when there aren't any pages or widget in the right toolbar and IF right_toolbar is disabled, contrary to the drawing toolbar that vanishes the widget bar stays there with the pill button to expand it whereas there isn't anything to expand.
- **Can’t enable header_compare feature without header_symbol_search.**
  - Disabling header_symbol_search should only hide the search button
  - Disabling header_compare should only hide the compare button
- **Removed section of PostCSS syntax in bundled css files.**

**Other**

- **New Documentation site.** 🎉
- **Add `shape` to TimeScale.** Shape property is described in [TimescaleMark interface](@api/interfaces/Charting_Library.TimescaleMark#shape).
- **Remove magnet icon near cursor.**

## Version 24

- `preset` Widget-Constructor parameter has been removed. Users can still use some featuresets to mimic the same behavior by disabling the following list:
  - `'left_toolbar', 'header_widget', 'timeframes_toolbar', 'edit_buttons_in_legend', 'context_menus', 'control_bar', 'border_around_the_chart'`
- `chart_style_hilo` featureset is now enabled by default. This adds the High-low option to chart style controls dropdown. This featureset has been available since 1.15 but was previously disabled by default.
- Added typings for custom indicators. Typescript equivalents of our existing examples are available here: [Custom Studies Typescript Examples](../custom_studies/Custom-Studies-Examples).
- [`symbol_search_complete`](../api/interfaces/Charting_Library.ChartingLibraryWidgetOptions#symbol_search_complete) has changed. The function now takes an additional search result object parameter, and returns an additional human-friendly symbol name.

**UI changes**

- With this version you will notice that the top toolbar has been redesigned with the following changes:

  - Button padding & separator size have been reduced
  - Compare button has shifted next to Symbol
  - Drawing icon is now more prominent
  - New fullscreen icon
  - Save button style better highlights when there's a change
  - Top toolbar now extends to left & right edges
  - UI font changes to a default system one
  - Undo/redo buttons are now relocated next to the save button

**Trading Terminal**

- Default formatter `textNoWrap` has been removed.
- `columnId` field of [SortingParameters](../api/interfaces/Broker.SortingParameters) has been renamed to `property`.
- Required `id` field has been added to [column description](../api/interfaces/Broker.AccountManagerColumnBase#id).
- Type of `formatter` field in [column description](../api/interfaces/Broker.AccountManagerColumnBase#formatter) has been changed to [StandardFormatterName | FormatterName](../api/enums/Charting_Library.StandardFormatterName).
- `property` field has been removed from `column description`. Use [dataFields](../api/interfaces/Broker.AccountManagerColumnBase#datafields) field instead.
- Type of `formatter` field in [SummaryField](../api/interfaces/Broker.AccountManagerSummaryField) has been changed to [StandardFormatterName](../api/enums/Charting_Library.StandardFormatterName).

## Older Versions

For breaking changes on older versions of the library please consult this page: [Breaking Changes](https://github.com/tradingview/charting_library/wiki/Breaking-Changes)
