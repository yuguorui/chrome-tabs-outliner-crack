/* Copyright 2012, 2013, 2014, 2015 by Vladyslav Volovyk. All Rights Reserved. */

"use strict";

var helpBlockHtmlContent = (function(f) {
  return f.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, '');
})(function() { /*
    <h2>How To Use <a id="printFriendlyBtn" class="hideInPrintFriendly" href="#"><img src="../../img/help_block/print.png" alt="print friendly version" title="print friendly version"/></a></h2>
    <span class="hideInPrintFriendly">(please resize the window to see all of the text)</span>

    <p>This extension is aimed at solving a complex problem (it is a really working solution to the "too many open tabs"
       trouble). So, inevitably, there is a learning curve and some new concepts... not too much, but there's some
       mental effort required. Don't just read - try things.</p>

    <hr />
    <h3>Quick start</h3>
    <ul>
    <li><img src="../../img/help_block/preserve_btn_v2.png" alt="close & save button" style="vertical-align: middle;
                    margin-bottom: -18px;
                                margin-left: -0px;
                                margin-right: -4px;
                                margin-top: -18px;"/> <b>Close and Save</b> - close a tab or window, but leave a link to it saved in the tree.</li>
    <li>Buttons with a blue background <img src="../../img/help_block/draged_btn.png"/ style="vertical-align: middle;
            margin-bottom: -18px;
            margin-top: -18px;"> on the Main Toolbar (find them at the bottom left corner of this window) expected to be <b>Drag and Droped</b> into the tree, to create additional nodes, like <b>notes</b> or <b>separators</b> where you drop them.
    <li>Drag some <b>selected text from a web page</b> to the tree to create a short note, <a target="_blank" href="https://www.youtube.com/watch?v=OqjcrfKjobY#t=189s">take a look.</a>
        <div class="remark">
        In the same way you can drag any link on the page or an url from the address bar into the tree.
        </div>
    <li>Use <b>Double click</b> to <b>activate</b> already open windows or tabs, <b>restore</b> saved items, <b>edit</b> notes, or <b>change</b> separator appearance.</li>
    <li><img src="../../img/help_block/delete_btn_v2.png" alt="delete button" style="vertical-align: middle;
                        margin-bottom: -18px;
                                    margin-left: -0px;
                                    margin-right: -2px;
                                    margin-top: -18px;"/>
        Delete (trash) removes only the highlighted node; to delete a node and all subnodes, <b>collapse</b> it first.
        <div class="remark">
        Open windows can be deleted without collapsing them, but this will not delete any items with notes,
        saved tabs, or other windows inside. You can effectively use this feature to leave as saved only marked tabs.
        (Just put the window in some other node before this, to prevent marked items falling to the root level).
        <p>
        Green Cross (save-close) button behaves the same way: it saves only the current item. If you want to save the
        hierarchy with other windows or tabs inside, in one click - collapse it first. Individual windows can be saved without collapsing them.
        </div>
    </li>

    <li>Tabs and Windows <b>will be saved automatically, on close,</b> if they <b>contain notes</b>.
        <div class="remark">
        Tabs and Windows by default disappears from the tree after being closed, <b>or on Chrome exit</b>.
        <p>
        However, if they have any custom style or <b>notes in direct subnodes</b> (or actually anything in subnodes that is not a some other regular open tab),
        their knots gain a green mark <img style="margin-bottom: -2px;" src="../../img/help_block/node_anchor_no_subnodes_protected.png"/>
        (or <img style="margin-bottom: -2px;" src="../../img/help_block/node_anchor_colapsed_protected.png"/>). And this mark indicates that after being closed
        by Chrome they will stay in the tree as <b>saved</b>, along with notes or other special subnodes, to preserve the context of your notes and edits.
        <!--<p>
        This is why <b style="color:#3362cd">Google Doc node</b>, created from the main toolbar, can be used to secure other tabs or windows.
        It is created with a custom color style for title. Thus, it will preserve itself on close, and, also, a parent node.
        -->
        <p>
        There are several other ways to preserve open items in the tree after their being closed from Chrome:
        <ul>
        <li style="list-style-type:circle">You can Ctrl-drag a hierarchy of open items to create a saved copy.
        <li style="list-style-type:circle">A window will be also saved on close (initiated by Chrome's window close button), along with all its tabs, if:
            <ul>
            <li>it is located not at the root level (for example in some Group or in other Window),
            <li>or has a custom title,
            <li>or contains in its own hierarchy any node that is not a regular open tab.
            </ul>
        </ul>
        <p>
        Note that the main (and simplest) method to keep tabs and windows in the tree, if you want to see them again
        after normal Chrome exit, is to save them explicitly, by pressing the green cross button
        <img src="../../img/help_block/preserve_cuted.png" alt="close button" style="vertical-align: middle;
                        margin-bottom: -18px;
                                    margin-left: -3px;
                                    margin-right: -2px;
                                    margin-top: -15px;">
        on them.
        <p>
        There is no need to put notes on items to save them automatically on close, in some distant future,
        <b>just save explicitly</b> by clicking the green cross.<b>You can safely ignore all these complex rules</b>,
        they only expand the cases when items will stay in the tree automatically, so the worst thing that might hapen
        is that you additionaly will be needed to delete something manually.

    </li>
    <li><img src="../../img/help_block/closeall_btn.png" style="vertical-align: middle; margin-bottom: -18px;  margin-top: -21px;">
        This button will <b>save</b> and <b>unload (close) all</b>
        open windows and tabs.
        <div class="remark" style="margin-top: 10px;"> You can use it before a Chrome exit, to preserve everything,
        or just if you need to switch focus and start some new work.
        </div>
    </li>
    <li><b>In case of sudden crash, everything that was open will stay in the tree as saved</b> regardless of whether there were notes on
        those items or not. You do not need to copy-save (by Ctrl-drag) open items, or add notes to them,
        to ensure their survival on Chrome or PC crash.
            <div class="remark">Advice: do not use Chrome's "Restore After Crash" feature. <p>
            That will create a lot of duplicates in the tree. To more easily acquire such a habit,
            first open the Tabs Outliner after the crash, <b>from the same window that asks about restore (without closing it)</b>,
            to convince yourself that everything is in place and ready to restore at any moment you wish.
            </div>
    </li>
    <!--<li>Use Ctrl-click (or middle click) on a tab to open it not in place, but in the last focused window. Shift-clicking on a tab will create a new window with it.-->
    </li>
    </ul>
    <hr />
    <h3>Short video tutorials</h3>
    <ul>
    <!--
        <li><a target="_blank" href="https://www.youtube.com/watch?v=OqjcrfKjobY">Tabs Outliner Overview.</a>
            <div class="remark">
            This is the same video you may be already saw in the Chrome Web Store before installing the Tabs Outliner.</div></li>
            -->

        <li><a target="_blank" href="http://www.youtube.com/watch?v=400g1JxDk7Q">Group and Note nodes as parents for tabs.</a>
            <div class="remark">
            This video demonstrates the difference between Group and Note nodes when they are used not in their primary roles
            (Group - to group other windows; Note - to mark and comment something in the tree) but for grouping tabs.
            <p>
            In short, the Group is actually a Saved Window and behaves accordingly.</div></li>

        <li><a target="_blank" href="http://www.youtube.com/watch?v=VvlK1ttZ3dI">How to quickly clean up a messy browsing session.</a>
            <div class="remark">
            This video presents a useful technique to quickly collect and confidently delete a garbage from the tree.
            <p>
            This is also good demonstration of Tabs Outliner's tree flexibility.
            This powerful use case is only possible because any node can be a parent for any other node,
            without special cases and exceptions.</div></li>
    </ul>
    <hr />

    <h3>FAQ</h3>
    <ul>
        <li><span id="q1" class="expandable-block-title toggleHlpBlock">
        How do I place a node <b>in between</b> other nodes, or <b>as the last</b> subnode? The drop area is too small?
        <div id="q1-body" class="help_block_expandable_section_body block_body_collapsed"><div style="display:inline-block">
        <div class="answer">
            To place a node between other nodes, on the same level, you must drop it not between node titles,
            but on the <b>vertical line</b> which connects nodes of this level (from which they “grow”).
            To place the node as last subnode on a level, drop it on the trailing dot of the level line, or
            on the empty area beneath the dot (it will be highlighted on hover). See these illustrations:
            <img style="display:block" src="../../img/help_block/where_to_drag.png"/>
        </div></div></div>
        </li>

        <li><span id="q7" class="expandable-block-title toggleHlpBlock">
        How to <b>search</b> through the tree?
        <div id="q7-body" class="help_block_expandable_section_body block_body_collapsed"><div style="display:inline-block">
        <div class="answer">
            Hit <b>Ctrl-F</b>
        </div></div></div>
        </li>

        <li><span id="q2" class="expandable-block-title toggleHlpBlock">
        Why does this window scroll all the time?
        <div id="q2-body" class="help_block_expandable_section_body block_body_collapsed"><div style="display:inline-block">
        <div class="answer">
            It scrolls on every window switch to show your currently active browser window and all its tabs always
            in a same position - at the top of this window.
            <p>
            This feature can be disabled in options.
            <p>
            Note that cloned views (opened by <img src="../../img/help_block/clone_btn.png" alt="Clone button"
                        style="vertical-align: middle; margin-bottom: -18px;  margin-top: -19px;"/>)
            does not auto scroll.
            <p>
            You can also undo some incidental auto scrolls by Undo Scroll <img src="../../img/help_block/undoscroll_btn.png" alt="Undo Scroll button"
                        style="vertical-align: middle; margin-bottom: -18px;  margin-top: -24px;"/>.

            This button can undo any scrolls, so it's also useful in combination with Scroll Up To Next Open Window
            <img src="../../img/help_block/window_up_btn.png" alt="options button"
                                     style="vertical-align: middle; margin-bottom: -18px;  margin-top: -17px;"/>
            (to scroll backwards). Also, when pressed in cloned view it will set cloned view scroll position to the same position as in the original view.
        </div></div></div>
        </li>

        <li><span id="q3" class="expandable-block-title toggleHlpBlock">
        If delete removes only the <b>highlighted</b> node, then why when I delete a window, all of its tabs are also gone?
        <div id="q3-body" class="help_block_expandable_section_body block_body_collapsed"><div style="display:inline-block">
        <div class="answer">
            This is because the tabs will go through the standard close process as a result
            of their containing window closing. The tabs are treated the same as if they were closed by you from Chrome window.
            <p>
            Note that, if some tabs have notes or other marks such tabs will be preserved in the tree as saved on their window close.
            <p>
            If you delete an expanded <b>saved</b> window, all its <b>saved</b> (gray) tabs will remain in the tree.
        </div></div></div>
        </li>

        <li><span id="q4" class="expandable-block-title toggleHlpBlock">
        How to <b>undo closed window/tab</b>, or restore a window that was open in last Chrome session?
        <div id="q4-body" class="help_block_expandable_section_body block_body_collapsed"><div style="display:inline-block">
        <div class="answer">
            To restore accidentally closed or deleted open windows and tabs you can right click in Chrome
            tab strip (in any open Chrome window) and select <b>"Reopen closed tab"</b> or <b>"Reopen closed window"</b>.
            <p>
            Alternatively, you can restore your tabs from the Chrome's <b>History and revcent tabs</b> menu item.
            <p>
            Note that this is also work after Chrome exit (or closing the last Chrome window), and this is
            why this extension does not automatically save last open window without any marks on normal Chrome exit (as some
            other session savers).
        </div></div></div>
        </li>

        <li><span id="q5" class="expandable-block-title toggleHlpBlock">
        How to use this extension as a <b>classic session saver</b> or instead of a <b>bookmarks</b> collections?
        <div id="q5-body" class="help_block_expandable_section_body block_body_collapsed"><div style="display:inline-block">
        <div class="answer">
            This extension facilitates a much more powerful way to deal with tabs overload.
            But some users do not have such problems and are completely satisfied with a
            more classical approach for collecting open tabs. It is possible to mimic them with Tabs Outliner.
            <p>
            A full saved <b>copy</b> of an open window can be created by <b>Ctrl-drag&drop</b>. This is
            an analog of saving the session separately from the list of open objects.
            <p>
            To restore the window without affecting and changing the saved copy you can:
            or clone this copy again and then restore this second copy;
            or, and this is more handy, to click on the saved tabs with Ctrl or Shift pressed.
            Just as on regular links or bookmarks Shift-click will open a new window with the clicked tab
            (in the end of the tree) and Ctrl-click (or middle click) will open the tab in the last focused open window.
            All of this happens without restoring the tabs in a saved copy.
            <p>
            This is also sometimes useful for opening a lot of links from different saved windows
            in a set of new windows in the end of the tree.
        </div></div></div>
        </li>

        <!--<li><span> How can I <b>protect open tab</b> from disappearance from tree on close (light the green light on them)?</li>-->

        <!--
        <li><span id="q6" class="expandable-block-title toggleHlpBlock">
        How to set a <b>custom color</b> for a node, as in Google Doc node created from main toolbar?
        <div id="q6-body" class="help_block_expandable_section_body block_body_collapsed"><div style="display:inline-block">
        <div class="answer">
            Currently there is no way, it is not implemented. <br/>Donations can make this available sooner. Many other cool
            features are also planned and really depend on your donations.
            <p>
            Note that custom styles (and everything else - position in hierarchy, notes,
            and in the future icons and labels) are not a property of the URL, but a property of a node in the tree.
            So if you reload the corresponding tab with another URL the title will remain blue, and will continue to protect
            the current tab URL from disappearing when containing tab will be <b>closed</b>.
            Yet if you open the same document manually in a new tab its node will not be any different from other nodes.
        </div></div></div>
        </li>
        -->

        <!--
        <li><span id="q9" class="expandable-block-title toggleHlpBlock">
        I like this project and want to <b>help</b>, where to put the <b>money</b>?
        <div id="q9-body" class="help_block_expandable_section_body block_body_collapsed"><div style="display:inline-block">
        <div class="answer">
            A donate button is in the About window (use the <img src="../../img/main_toolbar/about/info-normal.png" alt="help button" style="vertical-align: middle; margin-bottom: -28px;
                margin-left: -9px;
                margin-right: -12px;
                margin-top: -32px;"/> icon in the main toolbar to open).

        </div></div></div>
        </li>
        -->

        <li><span id="q10" class="expandable-block-title toggleHlpBlock">
        How to <b>export</b> the tree, to share or reopen it on another computer.
        <div id="q10-body" class="help_block_expandable_section_body block_body_collapsed"><div style="display:inline-block">
        <div class="answer">
            You can export and share your full tree, or only some hierarchies, by dragging them in a Google Doc document
            (Evernote, Microsoft Word, and many other programs also work).
            <p>
            Also, to do a backup/export you can perform standard "Save as complete Html" operation in the Tabs Outliner window (by Ctrl-S).
            The resulting file will be very usable to reopen all your tabs, as they will be exported as regular HTML links.
            You will even be able to drag anything from such a file back to the main Tabs Outliner window.
            <p>
            Please note that only expanded nodes will be exported, so click Expand All button before this operation (expand all
            can be undone by a second click on this button).
            <p>
            Also, after Upgrading to a paid license there will be an additional option to open a Google Drive backup of your tree
            directly from the Google Drive using any connected to your Google Drive account instance of Tabs Outliner (or mobile application in the near future)
        </div></div></div>
        </li>

    </ul>



    <hr />
    <h3 id="howToUseV1" class="expandable-block-title toggleHlpBlock">More verbose guide</h3>
    <div id="howToUseV1-body" style="position:relative;left:-30px;padding-left:30px;width: 100%;" class="help_block_expandable_section_body block_body_collapsed"><div style="display:inline-block">
    <ul>
    <li class="tip"><span class="tipimg"><img src="../../img/help_block/tree_illustration.png"/></span><span class="tiptext">
        You are now in the Main View. This shows you all your open windows and tabs in the form of a tree. This tree is completely
        rearrangeable by drag & drop. You can drag & drop window nodes to tabs, assign some special subnodes (like notes)
        to othere nodes (more on this later), change the order of windows, liberate tab nodes to new windows by dropping
        them between window nodes (try it, tip: when dragging a tab from a window to liberate it in a new window, aim (and drop)
        at the left-most vertical line which connects the window nodes to the root of tree).
        <p>
        The main view <b>autoscroll itself</b> on every browser window switch to show you currently active Chrome window
        <b>in the first line</b> - so you can always easily see all of the tabs in the currently active window.
        <p>
        Closed tabs and windows by default disappear from the tree, if they not contains some custom notes.</li>

 <li class="tip"><span class="tipimg tipimgbtn"><img src="../../img/help_block/clone_btn.png"/></span><span class="tiptext">
        This button will clone the current view. <b>Cloned views do not auto-scroll</b> when active Chrome window switches and because you can drag nodes from one view to another they allow
        easier drag & drop between distant parts of the tree.
        <p>
        Сloned views, on open, scroll self to show end of the tree (drag from middle of the tree in one view to the end of the tree in the other is most common operation).
        To scroll a cloned view to the <b>same position</b> as the view from which it is cloned click the Undo Scroll button <img src="../../img/help_block/undoscroll_btn.png" style="margin-top: -17px; margin-bottom: -17px;"/> in cloned view.
        <p>
        A notable difference of Cloned views is that they will not autoscroll themselves when the active Chrome window changes
        (the main view constantly autoscrolls to always show the tabs of the current window). When you need to greatly rearrange
        your tree, or plan to work exclusively with a same region of tree for some time, use cloned views as they will not needlessly jump.
        <p>
        The <b>Undo Scroll</b> button can also be used to <b>undo the last autoscroll</b> in the main view.</span></li>

    <!--<li class="tip"><span class="tipimg"><img src="../../img/help_block/preserve_btn.png"/></span><span class="tiptext">-->
    <li class="tip"><span class="tipimg" style="overflow:visible"><img src="../../img/help_block/preserve_btn_v2.png" style="position:relative; top:1px; left:-29px"/></span><span class="tiptext">
        This is the Close & Save button. It appears only on
        nodes which represent open windows or tabs. It will close them (unload from memory), but leaves links to them
        in the tree! So you will be able to restore closed this way tabs and entire windows anytime you want and in same context.
        <p>
        Note that you may close-save individual tabs in a window, they then will not dissappear from the tree even if you close their parent window.
        </span></li>

    <li class="tip"><span class="tipimg"><img src="../../img/help_block/dblcklick_illustration.png"/></span><span class="tiptext">
        Use Double-Click to reopen preserved (saved) tabs & windows <br/>or bring them to the front if they already open.
        <p>
        Alternatively, because preserved(saved) tabs are represented by standard html links, you can shift-click to open
        them in a new window, or cntrl-click to open them in last focused window, or drag&drop them to any open browser window
        (this will not affect a clicked node, it will create new tabs & windows).
        <p>
        Try all of this to better understand and remember!
        </span></li>

    <!--<li class="tip"><span class="tipimg"><img src="../../img/help_block/delete_btn.png"/></span><span class="tiptext">-->
    <li class="tip"><span class="tipimg" style="overflow:visible"><img src="../../img/help_block/delete_btn_v2.png" style="position:relative; top:1px; left:-29px"/></span><span class="tiptext">
        This button will completely delete a highlighted node from the tree (and if this node represents an open tab or window they
        will be closed), all subnodes will be promoted in place of the deleted node. <b>To remove an entire subtree first
        collapse it</b>.
        <p>
        The delete operation does not delete subnodes (if the node is not collapsed), only the highlighted node. But, if you delete a node
        which represents an open window, then, during window closing, all open tabs of this window will be also automatically
        shut down and as a result (if they do not have some special subnodes - see below) they will disappear from tree.
        </span></li>

     <li  class="tip"><span class="tipimg" style="overflow:visible"><img src="../../img/help_block/collapse_circle_btn.png" style="position:relative; top:1px; left:-29px"/></span><span class="tiptext">
        To quickly collapse subnodes before deleting or saving complete hierarchy click on the circle in the node's hovering menu.
        </span></li>

    <li class="tip"><span class="tipimg tipimgbtn"><img src="../../img/help_block/draged_btn.png"/></span><span class="tiptext">
        Buttons with a blue background are expected to be drag&droped somewhere in the tree, not just clicked. They represent
        additional nodes (read tooltips on them to learn what). If just clicked they add corresponding nodes to the end of the tree.
        <p>
        Click, or better, <b>drag to tree</b>, all of them, to learn what nodes they create.
        </span></li>

    <li class="tip"><span class="tipimg" style="overflow: visible;"><img src="../../img/help_block/close_vs_preserved.png"/></span><span class="tiptext">
        The most complex concept of this extension is understanding when nodes which represent open tabs & windows disappear from tree,
        after the corresponding object was closed in Chrome and when they stay.
        <p>
        The idea is that windows and tabs nodes are preserved in the tree if you close them by the
        <img src="../../img/help_block/preserve_cuted2.png" alt="close button" style="vertical-align: middle;
                        margin-bottom: -18px;
                                    margin-left: -3px;
                                    margin-right: -2px;
                                    margin-top: -15px;"/>
        button, or! if they have some manually assigned subnodes which are not a regular open tabs.
        <p>
        So if you close some tab using the standard Chrome tab close button
        <img src="../../img/help_block/chrome_tab_close.png" alt="close button" style="vertical-align: middle;
        margin-bottom: -28px;
            margin-left: -2px;
            margin-right: -2px;
            margin-top: -32px;"/> or by closing the Chrome window
        <img src="../../img/help_block/chrome_win_close.png" alt="close button" style="vertical-align: middle;
        margin-bottom: -28px;
                    margin-left: -3px;
                    margin-right: -1px;
                    margin-top: -32px;"/>,
        the corresponding node will be removed from the tree. But only if they do not have any special subnodes, like notes, saved tabs, other
        windows, groups - anything that is not an open tab. If they have some of these nodes, as children, then they will be preserved in tree,
        the same as if you pressed
        <img src="../../img/help_block/preserve_cuted.png" alt="close button" style="vertical-align: middle;
                margin-bottom: -18px;
                            margin-left: -3px;
                            margin-right: -2px;
                            margin-top: -15px;"/>
        on them. So you will not lose the context for your notes.
        <p>
        In future releases this will expand to cover manually placed icons, tags, labels, custom styles.
        <p>
        The idea is - everything you place manually on an open tab node will protect it from deletion after the tab is closed.
        <p>
        Additionally, all nodes for open tabs and windows will be <b>automatically preserved</b> in case of sudden pc or <b>browser crash</b>.
        </span></li>

    <li class="tip"><span class="tipimg tipimgbtn"><img src="../../img/help_block/closeall_btn.png"/></span><span class="tiptext">
        This is Close & Preserve All Open Windows Button - will be very handy in times when you cannot stop yourself from procrastinating
        by net surfing and need to start working.
        <p>
        It will warn you before acting with a confirmation dialog; and not unreversible, as you will be able to easily find
        and reload any of the closed windows and tabs at a more convenient time.
        <p>
        If you constantly accumulate a pile of open tabs you can actually save yourself a lot of productive time and computer
        resources by regularly using this feature. Because all of the saved tabs become much less tempting after some time,
        and most of them actually was open only to remind you of something, not because their content is constantly needed.
        <p>
        Often this "remind me" information is not in some specific tab, but rather in the context as whole (all of the open tabs and windows) -
        all of these tabs and windows will be preserved during close, so you will no longer fear losing this context during a total browser shutdown
        (as it is often the case). Thus this total close of all Chrome windows will become psychologically much more easy.
        <p>
        Usually you will reopen only a small number of closed tabs later, delete others, or simply leave
        them as is. It is harmless to keep the tabs as saved in tree; you do not need to constantly clean-up your tree; the tree over time will become you browsing workbook and diary.
        <p>
        Please note that the content of tab is not saved locally during close-preserving (this feature is actually planed)
        so you will need Internet access when you decide to restore them. Tab history is also not saved,
        as this is not supported by Chrome API meantime.
        <p>
        One very handy alternative of this button is killing the Chrome parent process through the system task manager. It's the fastest way to save all windows,
        release all resources, and start new fresh browsing session.
        </span></li>


    <li class="tip"><span class="tipimg tipimgbtn"><img src="../../img/help_block/separator_btn.png"/></span><span class="tiptext">
        You can cycle through different appearances of a Separator node (<img src="../../img/help_block/separator_cycles.png" style="margin-bottom: -0.23em;"/>) by double clicking on it
        when it's placed in the tree.
        <p>
        Learn all other buttons by reading their tooltips and clicking them. It is safe to experiment; they do not do anything
        radical.
        </span></li>

    <!--
    <li class="tip"><span class="tipimg"></span><span class="tiptext">
        See additional tips <a href="http://gdfg/">there</a>
        </span></li>
    -->
    </ul>
    </div></div>
    <hr />
    <h3 id="PaidFeatures" class="expandable-block-title toggleHlpBlock">Paid features</h3>
    <div id="PaidFeatures-body" style="position:relative;left:-30px;padding-left:30px;width: 100%;" class="help_block_expandable_section_body block_body_collapsed"><div style="display:inline-block">
    This tool was for several years free, with an expectation that donations might enable further development. Unfortunately, they were basically at zero, and so was the development of new features. A typical situation actually in the Chrome Web Store with similar tools.
    <p>
    So, to try some other approaches and to be able fund the development of many badly needed improvements there are now some paid features.
    <p>
    Need to note that nothing that was there for free, before, is restricted, so all positive reviews still relevant.
    And, like the thousands reviewers of the old version, who find it genuinely useful, even without any additional features,
    you still can use this program with a great success without paying for an upgrade and without enabling additional features.
    However, paid features add the whole new dimension of this tool and the safety for your data.
    <p>
    Upgrade will enable:
    <p>
    <ul>
    <li><h4>Complete keyboard support and additional commands</h4>
    You can review what keyboard shortcuts and additional commands will be available after the upgrade by invoking the context menu of any node in the tree (by right mouse click).
    <p>
    <img style="display:block; margin: auto;" src="../../img/help_block/contextmenu.png"/>
    <p>
    Context menu is also serving as a handy reference for keyboard shortcuts of all available commands.
    <p><p>
    The most important shortcuts to remember is:
    <ul>
    <li>[Ins] and [Enter]  to add notes inside and after the current node.
    <li>[Ctrl+Arrows] to move current node/note around ([Tab] also works)
    <li>[F2] to edit current note, window/group title or to add an inline note for the current tab.
    </ul>
    <p>
    Check more supported shortcuts by invoking context menu.

    <li><h4>Global Chrome keyboard shortcuts</h4>
    A paid license enables you to use global keyboard shortcuts in Chrome for
    <ul>
        <li>Opening the Tabs Outliner
        <li>Save and Close the current tab
        <li>Save and Close the current window
        <li>Save and Close all of the open windows
    </ul>
    <p>
    To configure these shortcuts go to the Chrome settings, select Extensions section and click Keyboard Shortcuts link at the bottom of the page.
    Alternatively you can copy and paste or drag and drop next link into the address bar: <a target="_blank" href="chrome://extensions/configureCommands">chrome://extensions/configureCommands</a> (it's
    not directly clickable because of the security restrictions that Chrome enforce on extensions)

    <li><h4>Full support for clipboard operations</h4>
    Usage of the clipboard, in additional for more ways to manipulate and adding content into the tree, also enables some new ways for exporting hierarchies.
    <p>
    For example, one of the very useful scenarios is an ability to copy and then paste some hierarchy into the instant messaging program (like Skype) text box in the form of plain text. For quickly share it with somebody.

    <li><h4>Automatic Daily Backups to the Google Drive</h4>
    When you start to use this tool, you will find that it is quickly accumulate many data that will be very unpleasant to lost.
    <p>
    Yet the locally stored in Chrome data is very prone to loss. As you can easily see, in reviews, the data loss is very common (and the number one reason for the low rates). It's true as for this tool as for many other extensions that store data locally in Chrome. Data loss can happen anytime, for many different reasons, often during automatic Chrome updates.
    <p>
    Automatic Google Drive backup solve this problem to a great extent. Meantime they are created only once per day, or can be invoked anytime manually. In future, it is planned to make them continuous, to solve the sudden data loss problem completely.
    <p>
    Please if you use this tool in the free mode perform regularly a manual export of the tree through Ctrl-S (save as complete html), to secure your data.

    <li><h4>Remote access for your data</h4>
    Google Drive backup feature not only make your data safe, they also add an ability to access your tree remotely, from your other Tabs Outliner instance installed on another PC.
    <p>
    You can check how it works by going to the Options and opening the Backup tab. From there you can invoke few backups manually. To check how they work and how it is possible to access your tree from a backup on the Google Drive.

    <li><h4>Automatic local backup snapshots created several times per hour</h4>
    They do not rescue you from an HDD fail, stolen notebook or weird  Chrome update or crash that clear all your data, as this do backups saved into the Google Drive. However, as they created much more often, they are useful to restore some accidentally or mistakenly deleted content, that was created after the last successful Google Drive backup (wich happens only once in 24 hours, if you do not invoke it manually).
    </ul>
    <p>
    To upgrade, go to the <a target="_blank" href="options.html" role="button">Options</a> and buy the license key.
    </div></div>
    <hr />
    <h3 id="tips" class="expandable-block-title toggleHlpBlock">Some useful tips</h3>
    <div id="tips-body" class="help_block_expandable_section_body block_body_collapsed"><div style="display:inline-block">
    <ul>
        <li> Flatten Tabs Hierarchy command (Paid Mode only) works starting from the current node, so it will flatten
        the tabs structure only beneath the current node, and have no effect if the current node has no tabs inside it.
        To see its effect best to invoke it on window nodes. It's primary goal to tidy up the tabs structure in windows.
        <li>Drag and Drop with the <b>Alt key</b> pressed in order to <b>copy</b> nodes around the tree. Any open tabs and
        windows you drag will be copied as saved (preserved).
            <div class="remark">
            One handy use case for this feature: you can quickly clone by this method some already placed nearby notes
            (like: “to read” or “to see comments”) to other tabs, without retyping them from scratch every time (also
            handy for separators).
            <p>
            Another useful case - to make a saved copy of some open window (with all the tabs), without save-closing it.
            <p>
            Note: it is also possible to do the same drag operation with the more standard <b>Ctrl key</b>, but unfortunately, drags with
            Ctrl key have some weird zoom behaviour in Chrome, near the left and right sides of window. So, a nonstandard
            (for such use case) <b>Alt key</b> is a way around this problem.
            </div>

        <li>Selected <b>text</b> or a <b>link</b> can be dragged from the outside into the Tabs Outliner window and dropped
        on the tree as note or saved tab. This is very useful for quickly creating notes (without manually typing) from a selected text on some page, or a link.
        Links from the Chrome address bar and bookmarks panel can also be dragged and copied to the tree this way.

        <li><img src="../../img/help_block/built_in_search.png" style="float:right"/>You can use <b>built-in Chrome search</b> functionality (hit Ctrl-F) to search through visible(expanded) nodes.

            <div class="remark">
            Collapse possibility there is more for some sort of "soft" delete and also to support deletion of the whole hierarchy (as by default delete work only for current node).
            <p>
            It is not convenient to collapse items for which you plan to return in future, as built in search is not working through collapsed items.
            <p>
            Expand All action is undoable by next click so you can safely expand all nodes before a search, to include in search all nodes, and then collapse everything back as it was before.
            </div>

        <li>A quick way to refresh all of the tabs in some open window is to save-close it and then open again immediately.
            This is also a way to quickly reopen rest of the saved tabs in a window if it is already has few open tabs.

        <li>You can multiselect tabs in Chrome's tabs strip and then drag them to form a new window, delete or move.
        <img style="display:block;margin:auto" src="../../img/help_block/tabs_strip_multiselect.png" />
        To multiselect several tabs click
        on them (in the Chrome's tabs strip, not in Tabs Outliner) with Ctrl pressed to select individual tabs, or Shift
        click to select a range of tabs. Then move the selected set of tabs as a whole to a new or existed window.
        <p>
        You can also close only the selected tabs or perform some other operations on them through the Chrome's tabs strip context menu.

        <li>Differences between Group and Note nodes. Besides the visual difference there is also a behavioral one.
        Either can serve as a subfolder on which you can place other nodes, but Group will transform itself to an open
        window if you move to it or restore inside of it a open tab.
        <p>
        Group is actually simple a saved window, with a fancy icon and name.
            <div class="remark">
            If you place a Group inside some window and then move some of the open tabs from this window to this group,
            these tabs will detach themselves from the original window and will appear in a new window, created in a place
            of the group node. Instead if you do the same with a Note, all of the tabs will remain in the original window.
            Try it to gain a better understanding.
            <p>
            Basically the main usage for Group is to group other windows. To be a folder. And Notes are meant to be a
            final node, something like Post It notes. Yet they can be used one instead of the other.
            </div>

        <li>Cloned Tab Outiliner views <b>does not auto-scroll</b> when the active Chrome window changes. They are very handy
        when you need perform a lot of rearranging in your tree or drag nodes between distant parts of the tree (you can
        drag nodes between different windows).

        <li>Cloned view (created by <img src="../../img/help_block/clone_btn.png" alt="Clone button" style="vertical-align: middle; margin-bottom: -18px;  margin-top: -19px;"/>
         button) on open scrolls to the end of the tree, but by pressing the Undo Scroll button <img src="../../img/help_block/undoscroll_btn.png" alt="Undo Scroll button"
                                 style="vertical-align: middle; margin-bottom: -18px;  margin-top: -24px;"/>
        in the cloned view you can set its scroll position same as in original view.


        <li>Expand All button<img src="../../img/main_toolbar/expand_all.png" class="actionButton" style="vertical-align: middle; margin-bottom: -18px;  margin-top: -19px;background: -webkit-linear-gradient(top, #ededed 0%, #d4d4d4 100%);">expands all collapsed nodes and <b>allows undoing</b> this action by
        next click on it (after the first click it will change icon to<img src="../../img/main_toolbar/undo_expand_all.png" class="actionButton" style="vertical-align: middle; margin-bottom: -18px;  margin-top: -19px;background: -webkit-linear-gradient(top, #ededed 0%, #d4d4d4 100%);">).<br/>
            <div class="remark">Expand All action is here mainly to allow use the <b>built-in Chrome search</b> functionality
            (Ctrl-F), as it is doing search only through the visible nodes. But it is also useful before saving Tabs Outliner
            window as HTML file, or before exporting the tree to Google Docs.</div>

        <li>You can reopen tabs represented by saved nodes without restoring them in place, by using cntrl/middle/shift
        click (or by their context menu). This is also a way to reopen tabs, from different saved windows and different
        parts of tree, in one or several new windows. It's also works for Chrome's bookmarks.
            <div class="remark">All tab nodes are represented by HTML links and there are standard browser
            operations which can be performed on any link which many are not aware of:
                <ul>
                <li style="list-style-type: circle; padding:0;">Shift click will always open the link in a new window.
                <li style="list-style-type: circle; padding:0;">Ctrl click (or middle click) in Tabs Outliner will open
                a link in the last focused Chrome window.
                </ul>
            You can combine these - create a new window by first clicking the link with shift-click, then,
            even without selecting the new window, open all additional links inside them with ctrl-click.
        </li>

        <li>
        <img src="../../img/help_block/liberate.png" style="float:right"/>
        It is very useful and often needed to liberate several tabs grouped in a subtree into a new window,
        nearby to the original window (in Tabs Outliner tree). To do this, drag tabs to the vertical root level line which
        connects all windows. <p> Once dropped they will form a new window in the drop location.


        <li>Up to Next Open Window button <img src="../../img/help_block/window_up_btn.png" style="vertical-align: middle; margin-bottom: -18px;  margin-top: -19px;"/> is
        an effective way to find the first open window in the tree, especially when it is
        buried deep inside the tree and surrounded by many saved windows.
         <p>
        To do so you can click it until the view will stop scrolling
        because there where no more open windows above, or scroll manually to the top of tree and then press this button
        to scroll back to the first open window.

        <li>This extension saves all open tabs in case of sudden Chrome or PC crash. It is better to restore them from
        the Tabs Outliner, <b>not by the restore feature built into Chrome</b>.
        <p>The Chrome restore feature will create new nodes for restored items, so you will have duplicates for all crashed-saved
        tabs.
            <div class="remark">This is annoying at first, but it is actually
            something that can be fixed by forming a useful new habit as most of the time it is a bad idea to restore
            everything that was crashed (maybe it will also be addressed someway in the future)
            </div>

        <li>If you often need reopen some predefined sets of tabs, the bookmarks bar is actually more useful for this than
        Tabs Outliner. I recommend enabling the bookmarks bar (Ctrl-Shift-B) and putting all frequently visited sites on it.
            <div class="remark">Take note that you can rename bookmarks, and the more shorter the names you will give to
            them the more bookmarks will be visible in the bookmarks bar. You can even completely delete a bookmark title
            and leave only the icon visible.
            <p>
            One more useful tip - you can group bookmarks in folders in the bookmarks bar, then, by Ctrl or middle
            click on the folder title you can reopen simultaneously all of the bookmarks in this folder.
            </div>

        <li>If you close-save a tab that contains a form in which you entered some data (but did not submit) your data will be lost. This is often the case when
        you write some message in a forum or comments section in some blog, yet for some reason you are not ready to send it, so it is hanging and waiting
        for your decision, and suddenly you decide that it is time to do some work, and close-save all open windows, forgetting about this form.
        There exists solutions for this problem. Extensions like “Lazarus Form Recovery” constantly monitors all your tabs and saves all entered data,
        so when you reopen a saved tab with some form in it, you will be able to easily restore all previously entered text.

        <!--<li>If you open a lot of tabs - set the Flash plugin to “Click to play mode” -
        here's is how: <a target="_blank" href="http://www.mytechguide.org/9445/disable-flash-content-google-chrome">www.mytechguide.org/9445/disable-flash-content-google-chrome</a>.
        This helps saving your computer resources and prevent videos from autoplaying.
        </li>-->

    </ul>
    </div></div>
    <hr />

    <h3>Prepare self for adaptation period</h3>
    <p>
    This extension becomes most effective when you start to use it instead of the system taskbar to observe and bring to front already
    open browser windows. Then the cognitive difference between saved and open tabs will be gone, and you will be
    able to close-save your windows & tabs, mix them with open tabs, and basically treat them in the same way. There will be no
    need anymore to leave something open in hope to find it later in the taskbar (to read it later, or to remind you about something).
    <p>
    This will result in much less open tabs, you will even be able to close them all without hesitation. And there of course
    are organizing and outlining features, to add notes and hints of why you leave something in the tree, and to triage, prioritize
    and group your postponed tabs.
    <p>
    But be prepared that this behaviour change will not happen instantly. I find that new users, for some time, instinctively
    continue to use the familiar OS taskbar to find own open Chrome windows. This will last up to a week.</p>

    <!--
    <hr />

    <h3>Please help spread the word about this extension</h3>
    <p>
    This software has actually completely sanitized my system from very severe and continued tab pollution
    and I am sure it can help for a lot of people. More new users will help all of us, by pushing for and funding faster evolution and
    arriving of new features (and there is a lot to be done).
    <p>
    <div style="border:2px dotted gray; border-radius: 3px; padding:5px">
    The simplest option to help is by going to the
    <a target="_blank" href="https://chrome.google.com/webstore/detail/tabs-outliner/eggkanocgddhmamlbiijnphhppkpkmkl/reviews">reviews section for this extension</a>,
    and give it a rating. These ratings and the stars average directly affect how many new users
    will be able to find Tabs Outliner. Your help is very needed there so please do this; this is a rare case when several
    clicks can do significant change. And it will really benefit all of us,
    there is already enough died "Vertical Tabs" extensions. Most likely you was not being able to find this tool if previous users
    do not rate it high, now it's your turn to help discover it for newcomers.
    </div>
    -->

    <div class="hideInPrintFriendly">
    <hr />
    <span id="hideHelpBtn" class="hide-btn">Hide</span>
    <input type="checkbox" id="doNotShowHelpBlockOnStartV2"/> do not show on open (can be shown again using

    <img src="../../img/main_toolbar/about/help-normal.png" alt="help button" style="vertical-align: middle;margin-left: -7px;margin-right: -11px;margin-top: -1px;"/> button)
    </div>
*/});
