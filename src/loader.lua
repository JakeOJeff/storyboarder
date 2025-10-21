local loader = {}
local input = require("src.elements.input")


function loader:load()
    fileInput = input:new(20, 20, 200, 5, love.graphics.getFont(), 3)
end

function loader:textInput(t)
    fileInput:textInput(t)
end

function loader:draw()
    fileInput:draw()
end




return loader