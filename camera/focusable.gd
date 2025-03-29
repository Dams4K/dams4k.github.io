extends Area2D
class_name FocusAble

func _input_event(viewport: Viewport, event: InputEvent, shape_idx: int) -> void:
	if event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_LEFT:
			var cam: Camera2D = viewport.get_camera_2d()
			if cam is ControlCamera2D:
				cam.focus_on = self
