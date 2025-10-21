local SceneryInit = require("src.libs.scenery")

lg = love.graphics
lk = love.keyboard
la = love.audio


local baseWidth = 1280
local baseHeight = 720
wW = love.graphics.getWidth()
wH = love.graphics.getHeight()

scale = math.max(wW / baseWidth, wH / baseHeight)

local scenery = SceneryInit(
    { path = "src.loader", key = "loader", default = true },
    { path = "src.open", key = "open" },
    { path = "src.new", key = "new" }

)

scenery:hook(love)
