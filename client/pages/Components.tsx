import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  FileText,
  ExternalLink,
  Copy,
  Check,
  Code,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComponentSpec {
  name: string;
  content: string;
  lastModified: string;
}

type Platform = "ios" | "android";
type ViewMode = "preview" | "code";

export default function Components() {
  const [components, setComponents] = useState<ComponentSpec[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentSpec | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePlatform, setActivePlatform] = useState<Platform>("android");
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedComponentType, setSelectedComponentType] = useState<
    "button" | "callitem"
  >("button");

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = async () => {
    try {
      const response = await fetch("/api/components");
      if (response.ok) {
        const data = await response.json();
        setComponents(data);
        if (data.length > 0) {
          setSelectedComponent(data[0]);
        }
      }
    } catch (error) {
      console.log("Components not available:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const getCallItemCodeExample = (platform: Platform) => {
    if (platform === "android") {
      return {
        component: `@Composable
fun SonetelCallItem(
    contactName: String,
    timeStamp: String,
    isMissedCall: Boolean = false,
    modifier: Modifier = Modifier,
    onClick: () -> Unit = {}
) {
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.98f else 1f,
        animationSpec = tween(100),
        label = "call_item_scale"
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .scale(scale)
            .clickable(
                interactionSource = interactionSource,
                indication = ripple()
            ) { onClick() }
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Avatar
            SonetelAvatar(
                modifier = Modifier.size(44.dp)
            )

            Spacer(modifier = Modifier.width(12.dp))

            // Content
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(2.dp)
            ) {
                Text(
                    text = contactName,
                                        style = SonetelTypography.Label.xlarge,
                    color = if (isMissedCall)
                        SonetelDesignTokens.alertCriticalLight
                    else
                        SonetelDesignTokens.solidZ7Light,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Text(
                    text = timeStamp,
                                        style = SonetelTypography.Label.large,
                    color = SonetelDesignTokens.solidZ5Light,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            // Info Button
            SonetelInfoButton(
                onClick = { /* Handle info click */ }
            )
        }
    }
}`,
        usage: `// Basic usage
SonetelCallItem(
    contactName = "John Doe",
    timeStamp = "2 min ago",
    onClick = { /* Handle call item click */ }
)

// Missed call
SonetelCallItem(
    contactName = "Jane Smith",
    timeStamp = "1 hour ago",
    isMissedCall = true,
    onClick = { /* Handle call item click */ }
)

// With custom click handlers
SonetelCallItem(
    contactName = "Alice Johnson",
    timeStamp = "Yesterday",
    onClick = { /* Handle call item click */ },
    modifier = Modifier.fillMaxWidth()
)`,
        subcomponents: `// SonetelAvatar Component
@Composable
fun SonetelAvatar(
    modifier: Modifier = Modifier,
    size: Dp = 44.dp
) {
    Box(
        modifier = modifier
            .size(size)
            .background(
                color = SonetelDesignTokens.solidZ7Light.copy(alpha = 0.04f),
                shape = CircleShape
            ),
        contentAlignment = Alignment.Center
    ) {
        Canvas(
            modifier = Modifier.size(size * 0.55f)
        ) {
            val path = Path().apply {
                // User icon SVG path from Figma
                moveTo(12f, 12f)
                cubicTo(14.21f, 12f, 16f, 10.21f, 16f, 8f)
                cubicTo(16f, 5.79f, 14.21f, 4f, 12f, 4f)
                // ... complete SVG path
            }
            drawPath(
                path = path,
                color = Color.Black.copy(alpha = 0.12f)
            )
        }
    }
}

// SonetelInfoButton Component
@Composable
fun SonetelInfoButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .size(48.dp)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = ripple(bounded = false, radius = 24.dp)
            ) { onClick() },
        contentAlignment = Alignment.Center
    ) {
        Canvas(
            modifier = Modifier.size(36.dp)
        ) {
            val path = Path().apply {
                // Info icon SVG path from Figma
                addOval(Rect(center = Offset(18f, 18f), radius = 18f))
                // ... complete SVG path
            }
            drawPath(
                path = path,
                color = Color.Black.copy(alpha = 0.6f)
            )
        }
    }
}`,
      };
    } else {
      return {
        component: `class SonetelCallItem: UIControl {

    var contactName: String = "" {
        didSet { updateContent() }
    }

    var timeStamp: String = "" {
        didSet { updateContent() }
    }

    var isMissedCall: Bool = false {
        didSet { updateAppearance() }
    }

    private let avatarView = SonetelAvatar()
    private let contactLabel = UILabel()
    private let timeLabel = UILabel()
    private let infoButton = SonetelInfoButton()
    private let stackView = UIStackView()
    private let contentStackView = UIStackView()

    override init(frame: CGRect) {
        super.init(frame: frame)
        setupCallItem()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupCallItem()
    }

    private func setupCallItem() {
        setupLayout()
        setupAppearance()
        setupInteraction()
    }

    private func setupLayout() {
        // Configure stack views
        contentStackView.axis = .vertical
        contentStackView.spacing = 2
        contentStackView.alignment = .leading

        stackView.axis = .horizontal
        stackView.spacing = 12
        stackView.alignment = .center

        // Add subviews
        contentStackView.addArrangedSubview(contactLabel)
        contentStackView.addArrangedSubview(timeLabel)

        stackView.addArrangedSubview(avatarView)
        stackView.addArrangedSubview(contentStackView)
        stackView.addArrangedSubview(infoButton)

        addSubview(stackView)

        // Setup constraints
        stackView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            stackView.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 16),
            stackView.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -16),
            stackView.topAnchor.constraint(equalTo: topAnchor, constant: 12),
            stackView.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -12)
        ])
    }

    private func setupAppearance() {
                contactLabel.font = SonetelTypography.labelXLarge
        timeLabel.font = SonetelTypography.labelLarge
        timeLabel.textColor = SonetelColors.solidZ5

        updateAppearance()
    }

    private func updateAppearance() {
        contactLabel.textColor = isMissedCall ?
            SonetelColors.alertCritical : SonetelColors.solidZ7
    }

    @objc private func touchDown() {
        UIView.animate(withDuration: 0.1) {
            self.transform = CGAffineTransform(scaleX: 0.98, y: 0.98)
        }
    }

    @objc private func touchUp() {
        UIView.animate(withDuration: 0.1) {
            self.transform = .identity
        }
    }
}`,
        usage: `// Basic usage
let callItem = SonetelCallItem()
callItem.contactName = "John Doe"
callItem.timeStamp = "2 min ago"

// Missed call
callItem.isMissedCall = true

// SwiftUI usage
SonetelCallItem(
    contactName: "John Doe",
    timeStamp: "2 min ago",
    isMissedCall: false,
    action: { /* Handle tap */ }
)`,
        subcomponents: `// SonetelAvatar
class SonetelAvatar: UIView {
    override func draw(_ rect: CGRect) {
        let path = UIBezierPath(ovalIn: rect)
        SonetelColors.solidZ7.withAlphaComponent(0.04).setFill()
        path.fill()

        // Draw user icon
        let iconSize = rect.width * 0.55
        let iconRect = CGRect(
            x: (rect.width - iconSize) / 2,
            y: (rect.height - iconSize) / 2,
            width: iconSize,
            height: iconSize
        )

        let iconPath = UIBezierPath()
        // Add user icon path here
        UIColor.black.withAlphaComponent(0.12).setFill()
        iconPath.fill()
    }
}

// SonetelInfoButton
class SonetelInfoButton: UIButton {
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupButton()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupButton()
    }

    private func setupButton() {
        setImage(createInfoIcon(), for: .normal)
        layer.cornerRadius = 24
    }

    private func createInfoIcon() -> UIImage? {
        // Create info icon programmatically
        // ... implementation
    }
}`,
      };
    }
  };

  const getCodeExample = (platform: Platform) => {
    if (platform === "android") {
      return {
        component: `@Composable
fun SonetelButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    size: ButtonSize = ButtonSize.Medium,
    variant: ButtonVariant = ButtonVariant.Primary,
    isLoading: Boolean = false,
    enabled: Boolean = true
) {
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed && enabled && !isLoading) 0.98f else 1f,
        label = "button_scale"
    )

    Button(
        onClick = onClick,
        modifier = modifier
            .scale(scale)
            .height(size.height)
            .let { mod ->
                size.minWidth?.let { minWidth ->
                    mod.widthIn(min = minWidth)
                } ?: mod
            },
        enabled = enabled && !isLoading,
        colors = ButtonDefaults.buttonColors(
            containerColor = variant.backgroundColor,
            contentColor = variant.textColor
        ),
        border = variant.borderColor?.let { BorderStroke(2.dp, it) },
        shape = RoundedCornerShape(size.height / 2),
        contentPadding = PaddingValues(
            horizontal = size.horizontalPadding,
            vertical = size.verticalPadding
        )
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(16.dp),
                color = variant.textColor,
                strokeWidth = 2.dp
            )
        } else {
            Text(
                text = text,
                fontSize = size.fontSize,
                fontWeight = FontWeight.SemiBold,
                letterSpacing = if (size == ButtonSize.ExtraLarge) (-0.36).sp else 0.sp
            )
        }
    }
}`,
        usage: `// Basic usage
SonetelButton(
    text = "Continue",
    onClick = { /* Handle click */ },
    size = ButtonSize.ExtraLarge,
    variant = ButtonVariant.Primary
)

// Loading state
SonetelButton(
    text = "Processing...",
    onClick = { },
    isLoading = true
)

// Full width
SonetelButton(
    text = "Sign In",
    onClick = { /* Handle click */ },
    modifier = Modifier.fillMaxWidth(),
    size = ButtonSize.Large
)`,
        enums: `enum class ButtonSize(
    val height: Dp,
    val horizontalPadding: Dp,
    val verticalPadding: Dp,
    val fontSize: TextUnit,
    val minWidth: Dp?
) {
    ExtraSmall(32.dp, 12.dp, 6.dp, 12.sp, null),
    Small(40.dp, 16.dp, 8.dp, 14.sp, null),
    Medium(36.dp, 16.dp, 8.dp, 14.sp, 72.dp),
    Large(56.dp, 24.dp, 16.dp, 18.sp, null),
    ExtraLarge(56.dp, 20.dp, 16.dp, 18.sp, 280.dp)
}

enum class ButtonVariant(
    val backgroundColor: Color,
    val textColor: Color,
    val borderColor: Color?
) {
    Primary(SonetelDesignTokens.solidZ7Light, SonetelDesignTokens.solidZ0Light, null),
    Secondary(SonetelDesignTokens.solidZ1Light, SonetelDesignTokens.solidZ7Light, null),
    Outline(Color.Transparent, SonetelDesignTokens.solidZ7Light, SonetelDesignTokens.solidZ7Light),
    Ghost(Color.Transparent, SonetelDesignTokens.solidZ7Light, null),
    Destructive(SonetelDesignTokens.alertCriticalLight, SonetelDesignTokens.solidZ0Light, null),
    Success(SonetelDesignTokens.accentsGreenLight, SonetelDesignTokens.solidZ0Light, null)
}`,
      };
    } else {
      return {
        component: `class SonetelButton: UIControl {
    
    var title: String = "" {
        didSet { updateTitle() }
    }
    
    var size: ButtonSize = .medium {
        didSet { updateAppearance() }
    }
    
    var variant: ButtonVariant = .primary {
        didSet { updateAppearance() }
    }
    
    var isLoading: Bool = false {
        didSet { updateLoadingState() }
    }
    
    private let titleLabel = UILabel()
    private let loadingIndicator = UIActivityIndicatorView(style: .medium)
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupButton()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupButton()
    }
    
    private func setupButton() {
        setupTitleLabel()
        setupLoadingIndicator()
        setupConstraints()
        updateAppearance()
        
        addTarget(self, action: #selector(touchDown), for: .touchDown)
        addTarget(self, action: #selector(touchUp), for: [.touchUpInside, .touchUpOutside, .touchCancel])
    }
    
    @objc private func touchDown() {
        UIView.animate(withDuration: 0.1) {
            self.transform = CGAffineTransform(scaleX: 0.98, y: 0.98)
        }
    }
    
    @objc private func touchUp() {
        UIView.animate(withDuration: 0.1) {
            self.transform = .identity
        }
    }
}`,
        usage: `// Basic usage
let primaryButton = SonetelButton()
primaryButton.title = "Continue"
primaryButton.size = .extraLarge
primaryButton.variant = .primary

// Loading state
primaryButton.isLoading = true

// SwiftUI usage
SonetelButton(
    title: "Continue",
    action: { /* Handle tap */ },
    size: .extraLarge,
    variant: .primary
)`,
        enums: `enum ButtonSize {
    case extraSmall, small, medium, large, extraLarge
    
    var height: CGFloat {
        switch self {
        case .extraSmall: return 32
        case .small: return 40
                case .medium: return 36
        case .large: return 56
        case .extraLarge: return 56
        }
    }
    
        var minWidth: CGFloat? {
        switch self {
        case .medium: return 72
        case .extraLarge: return 280
        default: return nil
        }
    }
}

enum ButtonVariant {
    case primary, secondary, outline, ghost, destructive, success
    
    var backgroundColor: UIColor {
        switch self {
        case .primary: return .solidZ7
        case .secondary: return .solidZ1
        case .outline: return .clear
        case .ghost: return .clear
        case .destructive: return .alertCritical
        case .success: return .accentsGreen
        }
    }
}`,
      };
    }
  };

  // Button configuration state
  const [buttonConfig, setButtonConfig] = useState({
    size: "Medium",
    variant: "Primary",
    state: "Default",
    text: "Label",
    fullWidth: false,
  });

  const getButtonStyles = () => {
    const sizeStyles = {
      "Extra Small": "h-8 px-3 text-xs min-w-[48px]",
      Small: "h-10 px-4 text-sm min-w-[64px]",
      Medium: "h-9 px-4 text-sm min-w-[72px]", // Updated to match Figma: 36px height, 72px min-width
      Large: "h-12 px-5 text-lg min-w-[80px]",
      "Extra Large": "h-14 px-5 text-lg min-w-[280px]",
    };

    const variantStyles = {
      Primary: "bg-foreground text-background",
      Secondary: "bg-secondary text-secondary-foreground border",
      Outline: "bg-transparent text-foreground border-2 border-foreground",
      Ghost: "bg-transparent text-foreground hover:bg-muted",
      Destructive: "bg-destructive text-destructive-foreground",
      Success: "bg-success text-success-foreground",
    };

    const stateStyles = {
      Default: "",
      Loading: "opacity-80 cursor-wait",
      Disabled: "opacity-50 cursor-not-allowed",
    };

    return `inline-flex items-center justify-center font-semibold rounded-full transition-all ${sizeStyles[buttonConfig.size]} ${variantStyles[buttonConfig.variant]} ${stateStyles[buttonConfig.state]} ${buttonConfig.fullWidth ? "w-full" : ""}`;
  };

  // Call Item configuration state
  const [callItemConfig, setCallItemConfig] = useState({
    type: "Default",
    state: "Default",
    contactName: "John Doe",
    timeStamp: "2 min ago",
  });

  const CallItemPreview = () => (
    <div className="bg-gradient-to-br from-muted/20 to-muted/5 rounded-2xl p-8 border">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Interactive Call Item Preview
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure the call item properties below to see the{" "}
          {activePlatform === "ios" ? "iOS" : "Android"} call item component
        </p>
      </div>

      {/* Call Item Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
        {/* Type Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Type
          </label>
          <select
            value={callItemConfig.type}
            onChange={(e) =>
              setCallItemConfig({ ...callItemConfig, type: e.target.value })
            }
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Default">Default</option>
            <option value="Missed">Missed</option>
          </select>
        </div>

        {/* State Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            State
          </label>
          <select
            value={callItemConfig.state}
            onChange={(e) =>
              setCallItemConfig({ ...callItemConfig, state: e.target.value })
            }
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Default">Default</option>
            <option value="Tapped">Tapped</option>
          </select>
        </div>

        {/* Contact Name Input */}
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Contact Name
          </label>
          <input
            type="text"
            value={callItemConfig.contactName}
            onChange={(e) =>
              setCallItemConfig({
                ...callItemConfig,
                contactName: e.target.value,
              })
            }
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Contact name"
          />
        </div>

        {/* Time Stamp Input */}
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Time Stamp
          </label>
          <input
            type="text"
            value={callItemConfig.timeStamp}
            onChange={(e) =>
              setCallItemConfig({
                ...callItemConfig,
                timeStamp: e.target.value,
              })
            }
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Time stamp"
          />
        </div>
      </div>

      {/* Live Call Item Preview */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-sm font-medium text-muted-foreground">
          Live Preview
        </div>
        <div className="w-full max-w-md">
          <div
            className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
              callItemConfig.state === "Tapped"
                ? "bg-muted/50 scale-[0.98]"
                : "bg-background hover:bg-muted/20"
            } border`}
            onClick={() => {
              setCallItemConfig({
                ...callItemConfig,
                state: callItemConfig.state === "Tapped" ? "Default" : "Tapped",
              });
              // Reset state after 150ms to simulate tap
              setTimeout(() => {
                setCallItemConfig((prev) => ({ ...prev, state: "Default" }));
              }, 150);
            }}
          >
            {/* Avatar */}
            <div className="w-11 h-11 bg-muted/40 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-muted-foreground/60"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3
                    className={`text-base font-medium truncate ${
                      callItemConfig.type === "Missed"
                        ? "text-destructive"
                        : "text-foreground"
                    }`}
                  >
                    {callItemConfig.contactName}
                  </h3>
                  <div
                    className="flex items-center gap-0.5"
                    style={{ marginTop: "2px" }}
                  >
                    <p className="text-sm font-medium text-muted-foreground">
                      {callItemConfig.timeStamp}
                    </p>
                  </div>
                </div>

                {/* Info Button */}
                <button className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-muted-foreground/60"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="m9,9 0,0 a3,3 0 1,1 6,0c0,2 -3,3 -3,3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m12,17 .01,0"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-muted/50 rounded-lg p-4 text-center max-w-md">
          <div className="text-sm space-y-1">
            <div className="font-medium">Current Configuration</div>
            <div className="text-muted-foreground">
              Type: {callItemConfig.type} • State: {callItemConfig.state}
            </div>
            {callItemConfig.type === "Missed" && (
              <div className="text-destructive text-xs mt-2 px-2 py-1 bg-destructive/10 rounded">
                ⚠️ Contact name uses alert.critical color for missed calls
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ComponentPreview = () => (
    <div className="bg-gradient-to-br from-muted/20 to-muted/5 rounded-2xl p-8 border">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          Interactive Button Preview
        </h3>
        <p className="text-sm text-muted-foreground">
          Configure the button properties below to see the{" "}
          {activePlatform === "ios" ? "iOS" : "Android"} button component
        </p>
      </div>

      {/* Button Controls */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
        {/* Size Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Size
          </label>
          <select
            value={buttonConfig.size}
            onChange={(e) =>
              setButtonConfig({ ...buttonConfig, size: e.target.value })
            }
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Extra Small">Extra Small</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Extra Large">Extra Large</option>
          </select>
        </div>

        {/* Variant Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Variant
          </label>
          <select
            value={buttonConfig.variant}
            onChange={(e) =>
              setButtonConfig({ ...buttonConfig, variant: e.target.value })
            }
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Primary">Primary</option>
            <option value="Secondary">Secondary</option>
            <option value="Outline">Outline</option>
            <option value="Ghost">Ghost</option>
            <option value="Destructive">Destructive</option>
            <option value="Success">Success</option>
          </select>
        </div>

        {/* State Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            State
          </label>
          <select
            value={buttonConfig.state}
            onChange={(e) =>
              setButtonConfig({ ...buttonConfig, state: e.target.value })
            }
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Default">Default</option>
            <option value="Loading">Loading</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>

        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Text
          </label>
          <input
            type="text"
            value={buttonConfig.text}
            onChange={(e) =>
              setButtonConfig({ ...buttonConfig, text: e.target.value })
            }
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Button text"
          />
        </div>

        {/* Full Width Toggle */}
        <div className="flex items-center">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={buttonConfig.fullWidth}
              onChange={(e) =>
                setButtonConfig({
                  ...buttonConfig,
                  fullWidth: e.target.checked,
                })
              }
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors ${buttonConfig.fullWidth ? "bg-primary" : "bg-muted"}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform mt-0.5 ${buttonConfig.fullWidth ? "translate-x-5" : "translate-x-0.5"}`}
              ></div>
            </div>
            <span className="ml-3 text-sm font-medium text-muted-foreground">
              Full Width
            </span>
          </label>
        </div>
      </div>

      {/* Live Button Preview */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-sm font-medium text-muted-foreground">
          Live Preview
        </div>
        <div className={`${buttonConfig.fullWidth ? "w-full max-w-md" : ""}`}>
          <button
            className={getButtonStyles()}
            disabled={buttonConfig.state === "Disabled"}
          >
            {buttonConfig.state === "Loading" ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                {buttonConfig.text}
              </div>
            ) : (
              buttonConfig.text
            )}
          </button>
        </div>

        {/* Specifications */}
        <div className="bg-muted/50 rounded-lg p-4 text-center max-w-md">
          <div className="text-sm space-y-1">
            <div className="font-medium">Current Configuration</div>
            <div className="text-muted-foreground">
              Size: {buttonConfig.size} • Variant: {buttonConfig.variant} •
              State: {buttonConfig.state}
            </div>
            {buttonConfig.size === "Medium" && (
              <div className="text-primary text-xs mt-2 px-2 py-1 bg-primary/10 rounded">
                ✨ Updated to match Figma: 36px height, 72px min-width
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const CodeBlock = ({
    code,
    language,
    id,
  }: {
    code: string;
    language: string;
    id: string;
  }) => (
    <div className="relative group">
      <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-t-lg border">
        <span className="text-sm font-medium text-muted-foreground">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(code, id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copiedCode === id ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </>
          )}
        </Button>
      </div>
      <pre className="bg-muted/20 p-4 rounded-b-lg overflow-x-auto text-sm border border-t-0">
        <code>{code}</code>
      </pre>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading components...</p>
        </div>
      </div>
    );
  }

  const codeExamples =
    selectedComponentType === "button"
      ? getCodeExample(activePlatform)
      : getCallItemCodeExample(activePlatform);

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Design System
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Mobile Components
            </h1>
            <p className="text-lg text-muted-foreground mt-2">
              Native iOS and Android component specifications with
              implementation guides
            </p>
          </div>
        </div>
      </div>

      {components.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Components Found</h3>
          <p className="text-muted-foreground mb-6">
            Component specifications will appear here after running the token
            build process.
          </p>
          <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-muted-foreground mb-2">
              To generate component specs:
            </p>
            <code className="text-sm bg-background px-2 py-1 rounded">
              npm run tokens:build
            </code>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Platform Toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-muted/50 p-1 rounded-lg">
              <div className="flex gap-1">
                <button
                  onClick={() => setActivePlatform("android")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activePlatform === "android"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                  Android
                </button>
                <button
                  onClick={() => setActivePlatform("ios")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activePlatform === "ios"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  iOS
                </button>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-muted/50 p-1 rounded-lg">
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode("preview")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === "preview"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </button>
                <button
                  onClick={() => setViewMode("code")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    viewMode === "code"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Code className="h-4 w-4" />
                  Implementation
                </button>
              </div>
            </div>
          </div>

          {/* Component Selection */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-muted/50 p-1 rounded-lg">
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedComponentType("button")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedComponentType === "button"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Button Component
                </button>
                <button
                  onClick={() => setSelectedComponentType("callitem")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    selectedComponentType === "callitem"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Call Item Component
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="border-b bg-muted/20 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">
                    {selectedComponentType === "button"
                      ? "Button Component"
                      : "Call Item Component"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        activePlatform === "ios"
                          ? "bg-primary/10 text-primary"
                          : "bg-success/10 text-success"
                      }`}
                    >
                      {activePlatform === "ios" ? (
                        <Smartphone className="h-3 w-3" />
                      ) : (
                        <Monitor className="h-3 w-3" />
                      )}
                      {activePlatform === "ios" ? "iOS" : "Android"}
                    </div>
                  </div>
                </div>
                <a
                  href={`/api/components/${selectedComponentType === "button" ? "Button" : "CallItem"}/download`}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Download Spec
                </a>
              </div>
            </div>

            <div className="p-6">
              {viewMode === "preview" ? (
                selectedComponentType === "button" ? (
                  <ComponentPreview />
                ) : (
                  <CallItemPreview />
                )
              ) : (
                <div className="space-y-6">
                  {/* Component Implementation */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Component Implementation
                    </h3>
                    <CodeBlock
                      code={codeExamples.component}
                      language={activePlatform === "ios" ? "Swift" : "Kotlin"}
                      id={`${activePlatform}-component`}
                    />
                  </div>

                  {/* Supporting Types / Subcomponents */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {selectedComponentType === "button"
                        ? "Supporting Types"
                        : "Subcomponents"}
                    </h3>
                    <CodeBlock
                      code={
                        selectedComponentType === "button"
                          ? codeExamples.enums
                          : codeExamples.subcomponents
                      }
                      language={activePlatform === "ios" ? "Swift" : "Kotlin"}
                      id={`${activePlatform}-${selectedComponentType === "button" ? "enums" : "subcomponents"}`}
                    />
                  </div>

                  {/* Usage Examples */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Usage Examples
                    </h3>
                    <CodeBlock
                      code={codeExamples.usage}
                      language={activePlatform === "ios" ? "Swift" : "Kotlin"}
                      id={`${activePlatform}-usage`}
                    />
                  </div>

                  {/* Quick Copy Section */}
                  <div className="bg-muted/20 rounded-lg p-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <ChevronRight className="h-4 w-4" />
                      Quick Actions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            codeExamples.component,
                            "quick-component",
                          )
                        }
                      >
                        {copiedCode === "quick-component" ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        Copy Component
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(codeExamples.usage, "quick-usage")
                        }
                      >
                        {copiedCode === "quick-usage" ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        Copy Usage
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            selectedComponentType === "button"
                              ? codeExamples.enums
                              : codeExamples.subcomponents,
                            "quick-enums",
                          )
                        }
                      >
                        {copiedCode === "quick-enums" ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {selectedComponentType === "button"
                          ? "Copy Types"
                          : "Copy Subcomponents"}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Design Tokens Section */}
          {selectedComponentType === "button" && (
            <div className="bg-card rounded-2xl border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Design Tokens for Current Configuration
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Tokens used by{" "}
                <span className="font-medium">
                  {buttonConfig.size} {buttonConfig.variant}
                </span>{" "}
                button in{" "}
                <span className="font-medium">{buttonConfig.state}</span> state
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Component Properties with Tokens */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Component Properties
                  </h4>
                  <div className="space-y-3">
                    {/* Height */}
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Height</span>
                        <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {buttonConfig.size === "Extra Small"
                            ? "32px"
                            : buttonConfig.size === "Small"
                              ? "40px"
                              : buttonConfig.size === "Medium"
                                ? "36px"
                                : buttonConfig.size === "Large"
                                  ? "48px"
                                  : "56px"}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Fixed value, not tokenized
                      </div>
                    </div>

                    {/* Border Radius */}
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">
                          Border Radius
                        </span>
                        <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          height/2
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Calculated from height (fully rounded)
                      </div>
                    </div>

                    {/* Background */}
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Background</span>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border shadow-sm ${
                              buttonConfig.variant === "Primary"
                                ? "bg-foreground"
                                : buttonConfig.variant === "Secondary"
                                  ? "bg-muted"
                                  : buttonConfig.variant === "Outline"
                                    ? "bg-transparent border-dashed"
                                    : buttonConfig.variant === "Ghost"
                                      ? "bg-transparent"
                                      : buttonConfig.variant === "Destructive"
                                        ? "bg-destructive"
                                        : "bg-green-600"
                            }`}
                          ></div>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                            {buttonConfig.variant === "Primary"
                              ? "solid.z7"
                              : buttonConfig.variant === "Secondary"
                                ? "solid.z1"
                                : buttonConfig.variant === "Outline"
                                  ? "transparent.t1"
                                  : buttonConfig.variant === "Ghost"
                                    ? "transparent"
                                    : buttonConfig.variant === "Destructive"
                                      ? "alert.critical"
                                      : "accents.green"}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Design token
                      </div>
                    </div>

                    {/* Text Color */}
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Text Color</span>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border shadow-sm ${
                              buttonConfig.variant === "Primary"
                                ? "bg-background"
                                : buttonConfig.variant === "Secondary"
                                  ? "bg-foreground"
                                  : buttonConfig.variant === "Outline"
                                    ? "bg-foreground"
                                    : buttonConfig.variant === "Ghost"
                                      ? "bg-foreground"
                                      : buttonConfig.variant === "Destructive"
                                        ? "bg-background"
                                        : "bg-background"
                            }`}
                          ></div>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                            {buttonConfig.variant === "Primary" ||
                            buttonConfig.variant === "Destructive" ||
                            buttonConfig.variant === "Success"
                              ? "solid.z0"
                              : "solid.z7"}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Design token
                      </div>
                    </div>

                    {/* Font Size */}
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Font Size</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {buttonConfig.size === "Extra Small"
                              ? "12px"
                              : buttonConfig.size === "Small" ||
                                  buttonConfig.size === "Medium"
                                ? "14px"
                                : "20px"}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                            {buttonConfig.size === "Extra Small"
                              ? "font.size.xs"
                              : buttonConfig.size === "Small" ||
                                  buttonConfig.size === "Medium"
                                ? "font.size.sm"
                                : "font.size.lg"}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Design token
                      </div>
                    </div>

                    {/* Padding */}
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Padding</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {buttonConfig.size === "Extra Small"
                              ? "4px 12px"
                              : buttonConfig.size === "Small"
                                ? "8px 16px"
                                : buttonConfig.size === "Medium"
                                  ? "8px 16px"
                                  : buttonConfig.size === "Large"
                                    ? "16px 20px"
                                    : "16px 20px"}
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                            {buttonConfig.size === "Extra Small"
                              ? "spacing.02×spacing.04"
                              : buttonConfig.size === "Small"
                                ? "spacing.03×spacing.05"
                                : buttonConfig.size === "Medium"
                                  ? "spacing.03×spacing.05"
                                  : buttonConfig.size === "Large"
                                    ? "spacing.05×spacing.06"
                                    : "spacing.05×spacing.06"}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Design tokens
                      </div>
                    </div>

                    {/* Font Weight */}
                    <div className="p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Font Weight</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            600
                          </span>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                            font.weight.bold
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Design token
                      </div>
                    </div>

                    {buttonConfig.variant === "Outline" && (
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Border</span>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-foreground rounded border shadow-sm"></div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                              solid.z7
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          2px solid, design token color
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Token Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Active Tokens
                  </h4>
                  <div className="space-y-3">
                    {/* Background Token */}
                    {buttonConfig.variant !== "Ghost" && (
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {buttonConfig.variant === "Primary"
                              ? "solid.z7"
                              : buttonConfig.variant === "Secondary"
                                ? "solid.z1"
                                : buttonConfig.variant === "Outline"
                                  ? "transparent.t1"
                                  : buttonConfig.variant === "Destructive"
                                    ? "alert.critical"
                                    : "accents.green"}
                          </span>
                          <div
                            className={`w-5 h-5 rounded border shadow-sm ${
                              buttonConfig.variant === "Primary"
                                ? "bg-foreground"
                                : buttonConfig.variant === "Secondary"
                                  ? "bg-muted"
                                  : buttonConfig.variant === "Outline"
                                    ? "bg-transparent border-dashed"
                                    : buttonConfig.variant === "Destructive"
                                      ? "bg-destructive"
                                      : "bg-green-600"
                            }`}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Used for:{" "}
                          <span className="font-medium">background-color</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Platform:{" "}
                          {activePlatform === "ios"
                            ? "UIColor.solidZ7"
                            : "SonetelDesignTokens.solidZ7Light"}
                        </div>
                      </div>
                    )}

                    {/* Text Color Token */}
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          {buttonConfig.variant === "Primary" ||
                          buttonConfig.variant === "Destructive" ||
                          buttonConfig.variant === "Success"
                            ? "solid.z0"
                            : "solid.z7"}
                        </span>
                        <div
                          className={`w-5 h-5 rounded border shadow-sm ${
                            buttonConfig.variant === "Primary" ||
                            buttonConfig.variant === "Destructive" ||
                            buttonConfig.variant === "Success"
                              ? "bg-background"
                              : "bg-foreground"
                          }`}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Used for:{" "}
                        <span className="font-medium">text-color</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Platform:{" "}
                        {activePlatform === "ios"
                          ? "UIColor." +
                            (buttonConfig.variant === "Primary" ||
                            buttonConfig.variant === "Destructive" ||
                            buttonConfig.variant === "Success"
                              ? "solidZ0"
                              : "solidZ7")
                          : "SonetelDesignTokens." +
                            (buttonConfig.variant === "Primary" ||
                            buttonConfig.variant === "Destructive" ||
                            buttonConfig.variant === "Success"
                              ? "solidZ0Light"
                              : "solidZ7Light")}
                      </div>
                    </div>

                    {/* Border Token (Outline only) */}
                    {buttonConfig.variant === "Outline" && (
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">solid.z7</span>
                          <div className="w-5 h-5 bg-foreground rounded border shadow-sm"></div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Used for:{" "}
                          <span className="font-medium">border-color</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Platform:{" "}
                          {activePlatform === "ios"
                            ? "UIColor.solidZ7"
                            : "SonetelDesignTokens.solidZ7Light"}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-muted/10 rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">
                        Non-tokenized properties:
                      </span>{" "}
                      Height and border-radius use fixed values. All other
                      properties (padding, font-size, font-weight) use design
                      tokens.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Call Item Design Tokens Section */}
          {selectedComponentType === "callitem" && (
            <div className="bg-card rounded-2xl border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Design Tokens for Call Item
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Tokens used by{" "}
                <span className="font-medium">
                  {callItemConfig.type} Call Item
                </span>{" "}
                in <span className="font-medium">{callItemConfig.state}</span>{" "}
                state
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Typography Tokens */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Typography Tokens
                  </h4>
                  <div className="space-y-3">
                    {/* Contact Name Typography */}
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Contact Name
                        </span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                          Label.xlarge
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        16px font size, 24px line height, -2% letter spacing
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Platform: SonetelTypography.Label.xlarge
                      </div>
                    </div>

                    {/* Time Stamp Typography */}
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Time Stamp</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                          Label.large
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        14px font size, 20px line height, -2% letter spacing
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Platform: SonetelTypography.Label.large
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Tokens */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Color Tokens
                  </h4>
                  <div className="space-y-3">
                    {/* Contact Name Color */}
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Contact Name Color
                        </span>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-5 h-5 rounded border shadow-sm ${
                              callItemConfig.type === "Missed"
                                ? "bg-destructive"
                                : "bg-foreground"
                            }`}
                          ></div>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                            {callItemConfig.type === "Missed"
                              ? "alert.critical"
                              : "solid.z7"}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {callItemConfig.type === "Missed"
                          ? "Red for missed calls"
                          : "Default text color"}
                      </div>
                    </div>

                    {/* Time Stamp Color */}
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Time Stamp Color
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-muted-foreground rounded border shadow-sm"></div>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                            solid.z5
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Secondary text color
                      </div>
                    </div>

                    {/* Avatar Background */}
                    <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Avatar Background
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-muted/40 rounded border shadow-sm"></div>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                            solid.z7 @ 4%
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        4% opacity of primary color
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Specifications */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Design Specifications
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Medium Height:</span>
                  <span className="font-mono">
                    36{activePlatform === "ios" ? "pt" : "dp"} (Updated)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Medium Min Width:
                  </span>
                  <span className="font-mono">
                    72{activePlatform === "ios" ? "pt" : "dp"} (New)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">X-Large Height:</span>
                  <span className="font-mono">
                    56{activePlatform === "ios" ? "pt" : "dp"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">XL Min Width:</span>
                  <span className="font-mono">
                    280{activePlatform === "ios" ? "pt" : "dp"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Border Radius:</span>
                  <span className="font-mono">Full (height/2)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Font Weight:</span>
                  <span className="font-mono">SemiBold (600)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Touch Target:</span>
                  <span className="font-mono">
                    {activePlatform === "ios" ? "44pt min" : "48dp min"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Press Animation:
                  </span>
                  <span className="font-mono">Scale 98%</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                {activePlatform === "ios" ? (
                  <Smartphone className="h-5 w-5 text-primary" />
                ) : (
                  <Monitor className="h-5 w-5 text-success" />
                )}
                {activePlatform === "ios" ? "iOS" : "Android"} Features
              </h3>
              <div className="space-y-2 text-sm">
                {activePlatform === "ios" ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>UIKit & SwiftUI support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Dynamic Type scaling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>VoiceOver accessibility</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Automatic dark mode</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Design token integration</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Jetpack Compose & XML support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Material 3 integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>TalkBack accessibility</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Dynamic theming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span>Design token integration</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
