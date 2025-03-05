def format_code(
    document,
    extra_param_1_override: str = None,
    extra_param_2_override: str = None,
) -> str:
    html_code = None

    if extra_param_1_override is not None:
        html_code = document.get("code").replace(f"[[widget_ep_1]]", extra_param_1_override)
    elif document.get("extra_param_1_default") is not None:
        html_code = document.get("code").replace(
            f"[[widget_ep_1]]", document.get("extra_param_1_default")
        )
    else:
        html_code = document.get("code")

    if extra_param_2_override is not None:
        html_code = html_code.replace(f"[[widget_ep_2]]", extra_param_2_override)
    elif document.get("extra_param_2_default") is not None:
        html_code = html_code.replace(
            f"[[widget_ep_2]]", document.get("extra_param_2_default")
        )

    return html_code