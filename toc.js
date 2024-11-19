// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item "><a href="Introduction/Introduction.html"><strong aria-hidden="true">1.</strong> Introduction</a></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="part-title">Debian Rock C4</li><li class="chapter-item "><a href="Debian_Rock/Debian_Rock.html"><strong aria-hidden="true">2.</strong> Debian Rock C4</a></li><li class="chapter-item "><a href="tmux/tmux.html"><strong aria-hidden="true">3.</strong> Terminal Multiplexing</a></li><li class="chapter-item "><a href="vim/vim.html"><strong aria-hidden="true">4.</strong> vim</a></li><li class="chapter-item "><div><strong aria-hidden="true">5.</strong> Fork Bomb</div></li><li class="chapter-item "><div><strong aria-hidden="true">6.</strong> Multi-Threading 1</div></li><li class="chapter-item "><div><strong aria-hidden="true">7.</strong> Multi-Threading 2</div></li><li class="chapter-item "><div><strong aria-hidden="true">8.</strong> System Calls</div></li><li class="chapter-item "><div><strong aria-hidden="true">9.</strong> Daemons</div></li><li class="chapter-item "><div><strong aria-hidden="true">10.</strong> UUID</div></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="part-title">BeagleBoard</li><li class="chapter-item "><a href="ChipExploration/ChipExploration.html"><strong aria-hidden="true">11.</strong> Exploring the Chips</a></li><li class="chapter-item "><a href="PinExploration/PinExploration.html"><strong aria-hidden="true">12.</strong> PinExploration</a></li><li class="chapter-item "><a href="GPIOLibrary/GPIOLibrary.html"><strong aria-hidden="true">13.</strong> GPIO C Library</a></li><li class="chapter-item "><a href="ADCLibrary/ADCLibrary.html"><strong aria-hidden="true">14.</strong> ADC C Library</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="ADCLibrary/ADCContinous.html"><strong aria-hidden="true">14.1.</strong> ADC Continous </a></li></ol></li><li class="chapter-item "><a href="PWMLibrary/PWMLibrary.html"><strong aria-hidden="true">15.</strong> PWM C Library</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="PWMLibrary/ADCtoPWM.html"><strong aria-hidden="true">15.1.</strong> ADC to PWM Library</a></li></ol></li><li class="chapter-item "><a href="Libioctrl/Libioctrl.html"><strong aria-hidden="true">16.</strong> libioctrl</a></li><li class="chapter-item "><div><strong aria-hidden="true">17.</strong> USB Ethernet</div><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><div><strong aria-hidden="true">17.1.</strong> USB to Ethernet sniffing tool</div></li></ol></li><li class="chapter-item "><div><strong aria-hidden="true">18.</strong> Mounting an SD</div></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="part-title">C</li><li class="chapter-item "><a href="Learning_C/Learning_C.html"><strong aria-hidden="true">19.</strong> Learning C</a></li><li class="chapter-item "><a href="EmbeddedC/Embedded.html"><strong aria-hidden="true">20.</strong> Embedded C</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="EmbeddedC/atmega328p.html"><strong aria-hidden="true">20.1.</strong> atmega328p</a></li><li class="chapter-item "><a href="EmbeddedC/avg_gcc.html"><strong aria-hidden="true">20.2.</strong> avr-gcc</a></li><li class="chapter-item "><a href="EmbeddedC/blink.html"><strong aria-hidden="true">20.3.</strong> Blink</a></li><li class="chapter-item "><a href="EmbeddedC/UART.html"><strong aria-hidden="true">20.4.</strong> UART</a></li><li class="chapter-item "><a href="EmbeddedC/adc.html"><strong aria-hidden="true">20.5.</strong> ADC</a></li><li class="chapter-item "><a href="EmbeddedC/pwm.html"><strong aria-hidden="true">20.6.</strong> PWM</a></li><li class="chapter-item "><div><strong aria-hidden="true">20.7.</strong> Full program</div></li></ol></li><li class="chapter-item "><li class="spacer"></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="part-title">Rust</li><li class="chapter-item "><div><strong aria-hidden="true">21.</strong> Intro to Rust</div></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="part-title">Bourne Again SHell</li><li class="chapter-item "><a href="Redirection/Redirection.html"><strong aria-hidden="true">22.</strong> Redirection</a></li><li class="chapter-item "><a href="Bash/Bash_Scripting.html"><strong aria-hidden="true">23.</strong> Bash</a></li><li class="chapter-item "><a href="ManPages/ManPages.html"><strong aria-hidden="true">24.</strong> Man Pages</a></li><li class="chapter-item "><a href="SystemsStats/SystemsStats.html"><strong aria-hidden="true">25.</strong> Systems Stats Script</a></li><li class="chapter-item "><a href="RFC_Logger/rfclogger.html"><strong aria-hidden="true">26.</strong> RFC Logger</a></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="part-title">Git</li><li class="chapter-item "><a href="myFirstRepository/myFirstRepository.html"><strong aria-hidden="true">27.</strong> My First Repository</a></li><li class="chapter-item "><a href="BranchingModel/BranchingModel.html"><strong aria-hidden="true">28.</strong> Branching-Strategy</a></li><li class="chapter-item "><a href="OneFlow/OneFlow.html"><strong aria-hidden="true">29.</strong> Git Oneflow</a></li><li class="chapter-item "><a href="AntiPatterns/AntiPatterns.html"><strong aria-hidden="true">30.</strong> Anti Patterns</a></li><li class="chapter-item "><a href="ContinousDeployment/ContinousDeployment.html"><strong aria-hidden="true">31.</strong> Continous Deployment</a></li><li class="chapter-item "><a href="ReleaseDeployment/ReleaseDeployment.html"><strong aria-hidden="true">32.</strong> Release Deployment</a></li><li class="chapter-item "><a href="Migration/Migration.html"><strong aria-hidden="true">33.</strong> Migration</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
