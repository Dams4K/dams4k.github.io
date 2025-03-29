extends Camera2D
class_name ControlCamera2D

@export var zoom_factor := 1.3

@export var focus_on: FocusAble : set = set_focus_on

var is_dragging := false

func _input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		if event.pressed:
			if event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
				zoom /= zoom_factor
			elif event.button_index == MOUSE_BUTTON_WHEEL_UP:
				zoom *= zoom_factor
		
		if event.button_index == MOUSE_BUTTON_MIDDLE:
			focus_on = null
			is_dragging = event.pressed
		
	if event is InputEventMouseMotion and is_dragging:
		position += -event.relative / zoom

func _process(delta: float) -> void:
	if focus_on != null:
		global_position = focus_on.global_position
		global_rotation = focus_on.global_rotation

func set_focus_on(value: FocusAble):
	focus_on = value
